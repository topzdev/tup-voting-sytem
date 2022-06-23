import apiClient from ".";
import { Candidate } from "./candidate.service";
import { ElectionOfficer } from "./election-officer.service";
import { Election } from "./election.service";
import { ElectionCounts, ElectionUrls } from "./overview.service";
import { Party } from "./party.service";
import { Position } from "./position.service";

const url = "/api/v1/results";

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
};

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

export type PrintElectionResult = {
  election: Election &
    ElectionCounts & {
      positions: Position[];
      party: Party[];
      urls: ElectionUrls;
      election_officers: ElectionOfficer[];
    };

  tally: FinalTallyPositions[];
};

const resultsServices = {
  async getResults(election_id: number): Promise<ElectionResult> {
    return (await apiClient.get(`${url}/final-results/${election_id}`)).data;
  },
  async getWinner(election_id: number) {
    return (await apiClient.get(`${url}/winners/${election_id}`)).data;
  },
  async exportResults(election_id: number) {
    return (await apiClient.get(`${url}/export-results/${election_id}`)).data;
  },
  async exportVoteAudit(election_id: number) {
    return (await apiClient.get(`${url}/export-vote-audit/${election_id}`))
      .data;
  },
  async resolveTie(dto: ResolveTieDTO): Promise<boolean> {
    return (await apiClient.post(`${url}/resolve-tie/`, dto)).data;
  },
  async resetTie(position_id: Position["id"]): Promise<boolean> {
    return (await apiClient.post(`${url}/reset-tie/`, { position_id })).data;
  },
  async publishResult(election_id: Election["id"]): Promise<boolean> {
    return (await apiClient.post(`${url}/publish/`, { election_id })).data;
  },
  async unPublishResult(election_id: Election["id"]): Promise<boolean> {
    return (await apiClient.post(`${url}/un-publish/`, { election_id })).data;
  },
  async printResult(election_id: Election["id"]): Promise<PrintElectionResult> {
    return (await apiClient.post(`${url}/print/`, { election_id })).data;
  },
};

export default resultsServices;
