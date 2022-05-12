import { Candidate } from "../candidate/entity/candidate.entity";
import { Position } from "../position/entity/position.entity";

export type ResultCandidate = Candidate & {
  votesCount: number;
  candidateName: string;
  votePercentage: number;
};

type ElectionResult = Omit<Position, "candidates"> & {
  candidates: ResultCandidate[];
  winners?: ResultCandidate[];
  totalVotes: number;
};

export type ElectionResults = ElectionResult[];

export type CandidatesWithSameVotes = {
  votesCount: number;
  candidates: ResultCandidate[];
};

export type TempVotesCount = {
  [votesCount: string]: CandidatesWithSameVotes;
};
