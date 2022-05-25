import apiClient from ".";
import { Organization } from "./organization.service";
import { User } from "./user.service";

export interface GetElectionOfficerQuery {
  search?: string;
  order?: any;
  page: number;
  take: number;
  organization_id: number;
}

export type ChangeRoleDto = Pick<User, "role" | "id">;

export type CreateElectionOfficerDto = Pick<
  User,
  "firstname" | "lastname" | "username" | "email_address"
> & {
  organization_id: Organization["id"];
};

export type UpdateElectionOfficerDto = Pick<
  User,
  "id" | "firstname" | "lastname" | "email_address" | "username"
>;

export type GetOfficerByIdDto = {
  user_id: User["id"];
  organization_id: Organization["id"];
};

const url = "/api/v1/election-officer";

const userServices = {
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

export default userServices;
