import apiClient from ".";
import { Candidate } from "./candidate.service";
import { Election } from "./election.service";
import { Position } from "./position.service";

export type LaunchpadElectionBallot = (Omit<Position, "election"> & {
  candidates: Candidate[];
})[];

export type LaunchpadElectionDetails = Pick<
  Election,
  "slug" | "title" | "start_date" | "close_date" | "final_status" | "logo"
>;

type ElectionStatus = "building" | "running" | "completed" | "archived";

export type ElectionWithStatusFinal = Election & {
  final_status: ElectionStatus;
};

export type LaunchpadValidationData = Omit<
  ElectionWithStatusFinal,
  "positions"
> & {
  votersCount: number;
  partiesCount: number;
  candidatesCount: number;
  positionsCount: number;
} & {
  positions: (Position & {
    candidatesCount: number;
  })[];
};

type ValidationSeverity = "warning" | "error" | "info";

export type LaunchpadValidation = {
  title: string;
  message: string;
  severity: ValidationSeverity;
};

export type ReturnLaunchpadValidation = {
  data: LaunchpadValidationData;
  validations: LaunchpadValidation[];
};

export type LaunchpadValidations = {
  errors: LaunchpadValidation[];
  warnings: LaunchpadValidation[];
  infos: LaunchpadValidation[];
};

const url = "/api/v1/launchpad";

const launchpadServices = {
  async getElectionBallot(
    election_id: number
  ): Promise<LaunchpadElectionBallot> {
    return (await apiClient.get(`${url}/ballot/${election_id}`)).data;
  },

  async getLaunchpadValidations(
    election_id: number
  ): Promise<LaunchpadValidation[]> {
    return (await apiClient.get(`${url}/validations/${election_id}`)).data;
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
