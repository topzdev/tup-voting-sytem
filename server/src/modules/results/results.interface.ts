import { Candidate } from "../candidate/entity/candidate.entity";
import { Election } from "../election/entity/election.entity";
import { Position } from "../position/entity/position.entity";

export type InitialCandidate = Candidate & {
  votesCount: number;
};

export type InitialPosition = Omit<Position, "candidates"> & {
  candidates: InitialCandidate[];
};

export type ResultCandidate = Candidate & {
  votesCount: number;
  candidateName: string;
  votePercentage: number;
  tie: boolean;
};

export type CandidateTieResult = {
  tie: boolean;
  candidates: ResultCandidate[];
  spotLeft: number;
};

export type FinalTallyCandidate = Pick<
  Candidate,
  "id" | "party" | "profile_photo" | "firstname" | "lastname" | "middlename"
> & {
  winner: boolean;
  votesCount: number;
  candidateName: string;
  votePercentage: number;
};

export type FinalTallyPositions = Pick<
  Omit<Position, "candidates">,
  | "id"
  | "title"
  | "max_selected"
  | "min_selected"
  | "is_tie_resolved"
  | "tie_resolved_message"
> & {
  candidates: FinalTallyCandidate[];
  totalVotes: number;
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
  tie_resolved_message?: string;
  candidatesWithPos: { candidate_id: Candidate["id"]; pos: number }[];
};

export type ResultPosition = Omit<Position, "candidates"> & {
  candidates: ResultCandidate[];
  totalVotes: number;
};

export type ResultPositionsWithWinner = Omit<ResultPosition, "candidates"> & {
  winners?: ResultCandidate[];
  candidates: (ResultCandidate | CandidateTieResult)[];
  isTieOccured: boolean;
};

export type ResultIssueMessage = {
  type: "position";
  id: string | number;
  resolved: boolean;
  message: string;
};

export type ResultIssue = {
  totalIssues: number;
  totalResolved: number;
  messages: ResultIssueMessage[];
};

export type ResultOtherInfo = {
  votersCount: number;
  votedCount: number;
};

export type ElectionResult = {
  positions: (ResultPositionsWithWinner | ResultPosition)[];
  other_info: ResultOtherInfo;
  issues?: ResultIssue;
};
