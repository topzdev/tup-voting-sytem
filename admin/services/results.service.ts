import apiClient from ".";
import { Candidate } from "./candidate.service";
import { Election } from "./election.service";
import { Position } from "./position.service";

const url = "/api/v1/results";

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

const resultsServices = {
  async getResults(election_id: number): Promise<ElectionResultWithWinner[]> {
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
};

export default resultsServices;
