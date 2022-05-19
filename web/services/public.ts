import { Candidate, Election, Party, Position } from "@/types/app";
import apiClient from ".";

const url = "/api/v1/public";

export type HomepageElections = {
  running: Election[];
  preview: Election[];
  completed: Election[];
};

export type HomepageParties = Party[];

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

type ElectionPageContent = {
  election: Election & {
    positions: Position[];
    party: Party[];
  };

  tally: FinalTallyPositions[];
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
