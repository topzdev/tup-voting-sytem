import apiClient from ".";
import { Candidate } from "./candidate.service";
import { Position } from "./position.service";

const url = "/api/v1/results";

type Candidates = Candidate & {
  votesCount: number;
};

export type ElectionResult = Omit<Position, "candidates"> & {
  candidates: Candidates[];
  candidateName: string;
  votePercentage: string;
};

export type ElectionResults = ElectionResult[];

const resultsServices = {
  async getResults(election_id: number): Promise<ElectionResults> {
    return (await apiClient.get(`${url}/final-results/${election_id}`)).data;
  },

  async getWinner(election_id: number) {
    return (await apiClient.get(`${url}/winners/${election_id}`)).data;
  },

  async exportResults(election_id: number) {
    return (await apiClient.get(`${url}/export-results/${election_id}`)).data;
  },

  async exportVoteAudit(election_id: number) {
    return (await apiClient.get(`${url}/export-results/${election_id}`)).data;
  },
};

export default resultsServices;
