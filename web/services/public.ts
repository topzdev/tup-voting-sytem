import { Candidate, Election, Party, Position } from "@/types/app";
import apiClient from ".";

const url = "/api/v1/public";

export type HomepageElections = {
  running: Election[];
  preview: Election[];
  completed: Election[];
};

export type HomepageParties = Party[];

type ElectionPageContent = Election & {
  positions: Position[];
  party: Party[];
};

type PartyPageContent = Party & {
  positions: Position[];
};

const publicServices = {
  async getElection(slug: string): Promise<ElectionPageContent> {
    return (await apiClient.get(`${url}/election/content/${slug}`)).data;
  },

  async getParty(party_id: number): Promise<PartyPageContent> {
    return (await apiClient.get(`${url}/party/${party_id}`)).data;
  },

  async getCandidates(candidate_id: number): Promise<Candidate> {
    return (await apiClient.get(`${url}/candidate/${candidate_id}`)).data;
  },

  async getHomepageElections(): Promise<HomepageElections> {
    return (await apiClient.get(`${url}/homepage/elections/`)).data;
  },

  async getHomepageParties(): Promise<HomepageParties> {
    return (await apiClient.get(`${url}/homepage/parties/`)).data;
  },
};

export default publicServices;
