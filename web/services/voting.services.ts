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

export type ElectionErrorMessage =
  | string
  | {
      title: string;
      body: string;
    };

type GetElectionBySlugReturn = {
  election: Election;
  error: ElectionErrorMessage;
};

type GetElectionByIdReturn = {
  election: Election;
  error: ElectionErrorMessage;
};

type GetBallotReturn = BallotItem[];

type GetCandidatesReturn = Candidate[];

type GetSubmitBallotReturn = ElectionBallot;

const url = "/api/v1/voting";

const votingServices = {
  async getElectionBySlug(slug: string): Promise<GetElectionBySlugReturn> {
    return (await apiClient.get(`${url}/election/slug/${slug}`)).data;
  },

  async getElectionById(election_id: number): Promise<GetElectionByIdReturn> {
    return (await apiClient.get(`${url}/election/id/${election_id}`)).data;
  },

  async getBallot(election_id: number): Promise<GetBallotReturn> {
    return (await apiClient.get(`${url}/ballot/${election_id}`)).data;
  },

  async getCandidates(candidate_id: number): Promise<GetCandidatesReturn> {
    return (await apiClient.get(`${url}/candidate/${candidate_id}`)).data;
  },

  async submitBallot(_ballot: BallotVotes): Promise<GetSubmitBallotReturn> {
    return (await apiClient.post(`${url}/ballot`, _ballot)).data;
  },
};

export default votingServices;
