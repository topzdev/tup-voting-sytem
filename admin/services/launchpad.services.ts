import apiClient from ".";
import { Candidate } from "./candidate.service";
import { Election } from "./election.service";
import { Position } from "./position.service";

export type LaunchpadElectionBallot = Position &
  {
    candidates: Candidate[];
  }[];

export type LaunchpadElectionDetails = Pick<
  Election,
  "slug" | "title" | "start_date" | "close_date" | "final_status" | "logo"
>;
const url = "/api/v1/launchpad";

const launchpadServices = {
  async getElectionBallot(
    election_id: number
  ): Promise<LaunchpadElectionBallot> {
    return (await apiClient.get(`${url}/ballot/${election_id}`)).data;
  },

  async getElectionDetails(
    election_id: number
  ): Promise<LaunchpadElectionDetails> {
    return (await apiClient.get(`${url}/detail/${election_id}`)).data;
  },
  async launchElection(election_id: number): Promise<Boolean> {
    return (await apiClient.post(`${url}/launch/${election_id}`)).data;
  },
};

export default launchpadServices;
