import apiClient from ".";
import {
  BallotItem,
  BallotOtherInfo,
  BallotVotes,
  Candidate,
  Election,
  ElectionBallot,
  Position,
} from "@/types/app";

const url = "/api/v1/public";

const votingServices = {
  async getElection(slug: string): Promise<any> {
    return (await apiClient.get(`${url}/election/${slug}`)).data;
  },

  async getParty(election_id: number): Promise<any> {
    return (await apiClient.get(`${url}/party/${election_id}`)).data;
  },

  async getCandidates(candidate_id: number): Promise<any> {
    return (await apiClient.get(`${url}/candidate/${candidate_id}`)).data;
  },

  async getHomepageContent(): Promise<any> {
    return (await apiClient.get(`${url}/ballot/`)).data;
  },
};

export default votingServices;
