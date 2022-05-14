import { Candidate } from "../candidate/entity/candidate.entity";
import { Election } from "../election/entity/election.entity";
import { Position } from "../position/entity/position.entity";

export type ResultCandidate = Candidate & {
  votesCount: number;
  candidateName: string;
  votePercentage: number;
};

export type ElectionResults = ElectionResult[];

export type CandidateTieResult = {
  tie: boolean;
  candidates: ResultCandidate[];
  spotLeft: number;
};

export type CandidatesWithSameVotes = {
  votesCount: number;
  candidates: ResultCandidate[];
};

export type TempVotesCount = {
  [votesCount: string]: CandidatesWithSameVotes;
};

export type ResolveTieDTO = {
  election_id: Election["id"];
  position_id: Position["id"];
  candidatesWithPos: { candidate_id: Candidate["id"]; pos: number }[];
};

export type ElectionResult = Omit<Position, "candidates"> & {
  candidates: ResultCandidate[];
  totalVotes: number;
};

export type ElectionResultWithWinner = Omit<ElectionResult, "candidates"> & {
  winners?: ResultCandidate[];
  candidates: (ResultCandidate | CandidateTieResult)[];
  isTieOccured: boolean;
  isTieResolved?: boolean;
};
