import exp from "constants";
import { Result } from "express-validator";
import { Candidate } from "../candidate/entity/candidate.entity";
import {
  CandidatesWithSameVotes,
  ElectionResults,
  ResultCandidate,
  TempVotesCount,
} from "./results.interface";

const sortAndSplice = (candidates: ResultCandidate[], max_selected: number) => {
  let temp = candidates;
  let sorted = temp.sort((a, b) => b.votesCount - a.votesCount);
  let spliced = sorted.slice(0, max_selected);
  return spliced;
};

export const properCandidates = (curCandidates: ResultCandidate[]) => {
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

export const getSimpleElectionResult = (result: ElectionResults) => {
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

export const getElectionResultWithWinners = (result: ElectionResults) => {
  const resultWithWinners = [];

  for (let i = 0; i < result.length; i++) {
    const currentPosition = result[i];
    const max_selected = currentPosition.max_selected;
    const min_selected = currentPosition.min_selected;

    const { candidates, totalVotes } = properCandidates(
      currentPosition.candidates
    );

    // const winners = sortAndSplice(candidates, max_selected);
    const winners = getWinnersWithPossibleTie(
      mergeCandidatesWithSameVotes(candidates),
      max_selected
    );
    resultWithWinners.push({
      ...currentPosition,
      totalVotes,
      candidates,
      winners,
    });
  }

  return resultWithWinners;
};

// merge all candidates with same votes and sort it to highest vote to lowest
export const mergeCandidatesWithSameVotes = (
  _candidates: ResultCandidate[]
) => {
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

// Get the winners and tied candidates
export const getWinnersWithPossibleTie = (
  _mergeCandidatesByVotes: CandidatesWithSameVotes[],
  _maxWinners: number
) => {
  // storing max winners
  let spotLeftCounter = _maxWinners;

  // declaring winners array where the candidates will be appended
  let partialWinners = [];

  // iterate on candidates with same votes
  _mergeCandidatesByVotes.forEach((item) => {
    let tempItem = item;

    // check if spot counter is greater than 0
    if (spotLeftCounter > 0) {
      // subtract the last value of spot counter to candidates
      let candidatesLength = tempItem.candidates.length;

      // check if there is a spot left  and candidates length is greater than the spot left also we add a tie and spotLeft properties to determined if its a tie and how many spot left so that we can determined whose candidate can be included on final winners.
      if (
        spotLeftCounter <= candidatesLength &&
        candidatesLength > spotLeftCounter
      ) {
        partialWinners.push({
          candidates: tempItem.candidates,
          tie: true,
          spotLeft: spotLeftCounter,
        });

        // if there is a spot then they are the finals winners
      } else {
        partialWinners = [...partialWinners, ...tempItem.candidates];
      }

      // subtract the last value of spot counter to candidates
      spotLeftCounter = spotLeftCounter - candidatesLength;
    }
  });

  return partialWinners;
};
