import apiClient from ".";
import { Election } from "./election.service";
import { Organization } from "./organization.service";
import { User } from "./user.service";

export type ElectionOfficer = {
  election_id: number;
  id: number;
  user: User;
};

export interface GetElectionOfficerQuery {
  search?: string;
  order?: any;
  page: number;
  take: number;
  election_id: number;
}

export type ChangeRoleDto = Pick<User, "role" | "id">;

export type CreateElectionOfficerDto = Pick<
  User,
  "firstname" | "lastname" | "username" | "email_address"
> & {
  election_id: Election["id"];
};

export type UpdateElectionOfficerDto = Pick<
  User,
  "id" | "firstname" | "lastname" | "email_address" | "username"
>;

export type GetOfficerByIdDto = {
  user_id: User["id"];
  election_id: Election["id"];
};

const url = "/api/v1/election-officer";

const electionOfficerServices = {
  async getAll(body: GetElectionOfficerQuery) {
    return (await apiClient.post(`${url}/all/`, body)).data;
  },
  async getById(body: GetOfficerByIdDto) {
    return (await apiClient.post(`${url}/one/`, body)).data;
  },

  async create(body: CreateElectionOfficerDto) {
    return (await apiClient.post(`${url}/create`, body)).data;
  },

  async update(body: UpdateElectionOfficerDto) {
    return (await apiClient.put(`${url}/update`, body)).data;
  },
};

export default electionOfficerServices;
