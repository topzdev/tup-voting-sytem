import exp from "constants";
import { Result } from "express-validator";
import { Candidate } from "../candidate/entity/candidate.entity";
import {
  CandidatesWithSameVotes,
  CandidateTieResult,
  ElectionResult,
  ElectionResults,
  ElectionResultWithWinner,
  ResultCandidate,
  TempVotesCount,
} from "./results.interface";

const sortAndSplice = (candidates: ResultCandidate[], max_selected: number) => {
  let temp = candidates;
  let sorted = temp.sort((a, b) => b.votesCount - a.votesCount);
  let spliced = sorted.slice(0, max_selected);
  return spliced;
};

const properCandidates = (curCandidates: ResultCandidate[]) => {
  const totalVotes = curCandidates.reduce(
    (partial, a) => partial + a.votesCount,
    0
  );

  const candidates = [] as ResultCandidate[];

  for (let e = 0; e < curCandidates.length; e++) {
    const currentCandidate = curCandidates[e];
    candidates.push({
      ...currentCandidate,
      candidateName: `${currentCandidate.lastname}, ${
        currentCandidate.firstname
      } ${currentCandidate.middlename.toUpperCase().split("")[0]}.`,
      votePercentage: parseFloat(
        ((currentCandidate.votesCount / totalVotes) * 100).toFixed(2)
      ),
    } as ResultCandidate);
  }

  return { totalVotes, candidates };
};

const getElectionResult = (result: ElectionResults) => {
  const simpleResult = [];

  for (let i = 0; i < result.length; i++) {
    const currentPosition = result[i];

    const { candidates, totalVotes } = properCandidates(
      currentPosition.candidates
    );

    simpleResult.push({
      ...currentPosition,
      totalVotes,
      candidates,
    });
  }

  return simpleResult;
};

const getElectionResultWithWinners = (result: ElectionResults) => {
  const resultWithWinners: ElectionResultWithWinner[] = [];

  for (let i = 0; i < result.length; i++) {
    const currentPosition = result[i];
    const max_selected = currentPosition.max_selected;
    const min_selected = currentPosition.min_selected;

    const initialResult = properCandidates(currentPosition.candidates);

    const mergeSameVote = mergeCandidatesWithSameVotes(
      initialResult.candidates
    );

    const finalResults = getResultsWithPossibleTie(mergeSameVote, max_selected);

    // const winners = sortAndSplice(candidates, max_selected);
    const winnerResult = getResultWinners(
      initialResult.candidates,
      max_selected,
      finalResults.istieOccured
    );

    resultWithWinners.push({
      ...currentPosition,
      totalVotes: initialResult.totalVotes,
      candidates: finalResults.candidates,
      isTieOccured: finalResults.istieOccured,
      isTieResolved: winnerResult.isTieResolved,
      winners: winnerResult.winners,
    });
  }

  return resultWithWinners;
};

// merge all candidates with same votes and sort it to highest vote to lowest
const mergeCandidatesWithSameVotes = (_candidates: ResultCandidate[]) => {
  let temp: TempVotesCount = {};

  //merging candidates with same votes
  _candidates.forEach(function (candidate) {
    let votesCount = candidate.votesCount.toString();

    // if the vote count is exist on temp object then create that vote count
    if (!temp[votesCount]) {
      temp = {
        ...temp,
        [votesCount]: {
          votesCount: Number(votesCount),
          candidates: [candidate],
        },
      };

      // and if vote count exist on temp object the append the candidate on items
    } else {
      const prevCandidates = temp[votesCount].candidates;
      temp[votesCount] = {
        votesCount: Number(votesCount),
        candidates: [...prevCandidates, candidate],
      };
    }
  });

  /*
  sample value of vote count temp object before parsing it to array of candidates with same vote count 
  {
    '3': { votesCount: 3,  candidates:[ [Object] ] },
    '5': { votesCount: 5,  candidates:[ [Object], [Object], [Object] ] },
    '6': { votesCount: 6,  candidates:[ [Object], [Object] ] }
  }
  */

  // generating an array of candidates with same vote count
  return Object.values(temp).sort((a, b) => b.votesCount - a.votesCount);

  /* 
  same of array of canddiate with same vote count
  [
    { votesCount: 6,  candidates:[ [Object], [Object] ] },
    { votesCount: 5,  candidates:[ [Object], [Object], [Object] ] },
    { votesCount: 3,  candidates:[ [Object] ] }
  ]  
  */
};

const getResultWinners = (
  _candidates: ResultCandidate[],
  _maxWinners: number,
  _istieOccured: boolean
) => {
  let winners;
  let isTieResolved;

  if (_candidates.length) {
    if (_istieOccured) {
      const hasPosition = _candidates[0].pos;

      if (hasPosition) {
        winners = _candidates
          .sort((a, b) => a.pos - b.pos)
          .splice(0, _maxWinners);
        isTieResolved = true;
      } else {
        isTieResolved = false;
      }
    } else {
      winners = _candidates
        .sort((a, b) => b.votesCount - a.votesCount)
        .splice(0, _maxWinners);
    }
  }
  return {
    winners,
    isTieResolved,
  };
};

// Get the candidates and tied candidates
const getResultsWithPossibleTie = (
  _mergeCandidatesByVotes: CandidatesWithSameVotes[],
  _maxWinners: number,
  _winnersOnly = false
) => {
  // storing max winners

  // declaring winners array where the candidates will be appended
  let candidates: (ResultCandidate | CandidateTieResult)[] = [];
  let istieOccured = false;
  let spotLeftCounter = _maxWinners;

  // iterate on candidates with same votes
  _mergeCandidatesByVotes.forEach((item) => {
    let tempItem = item;

    // check if spot counter is greater than 0
    // subtract the last value of spot counter to candidates
    let candidatesLength = tempItem.candidates.length;

    // check if there is a spot left  and candidates length is greater than the spot left also we add a tie and spotLeft properties to determined if its a tie and how many spot left so that we can determined whose candidate can be included on final winners.
    if (spotLeftCounter > 0) {
      if (
        spotLeftCounter &&
        spotLeftCounter <= candidatesLength &&
        candidatesLength > spotLeftCounter
      ) {
        candidates.push({
          candidates: tempItem.candidates,
          tie: true,
          spotLeft: spotLeftCounter,
        });

        istieOccured = true;
        // if there is a spot then they are the finals winners
      } else {
        candidates = [...candidates, ...tempItem.candidates];
      }
    } else {
      if (!_winnersOnly) {
        candidates = [...candidates, ...tempItem.candidates];
      }
    }

    // subtract the last value of spot counter to candidates
    spotLeftCounter = spotLeftCounter - candidatesLength;
  });

  return {
    candidates,
    istieOccured,
  };
};

const resultHelpers = {
  getElectionResult,
  getElectionResultWithWinners,
};

export default resultHelpers;
