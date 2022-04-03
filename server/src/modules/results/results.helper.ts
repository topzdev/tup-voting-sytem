import exp from "constants";
import { Result } from "express-validator";
import { ElectionResults, ResultCandidate } from "./results.interface";

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

    const winners = sortAndSplice(candidates, max_selected);
    resultWithWinners.push({
      ...currentPosition,
      totalVotes,
      candidates,
      winners,
    });
  }

  return resultWithWinners;
};
