import apiClient from ".";
import transformParamsToUrl from "@/helpers/paramsToUrl.helpers";
import { Election } from "./election.service";

export type DataTimestamp = {
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
};

export type Voters = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email_address: string;
  pin: string;
  is_allowed: boolean;
  election_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  election: Election;
} & DataTimestamp;

export interface GetVotersDto {
  search?: string;
  order?: any;
  page: number;
  take: number;
}

export interface GetVoterElectionDto {
  order?: any;
  page: number;
  take: number;
  voter_id: number;
}

export type GetElectionMembersDto = {
  election_id: number;
};

export type CreateVotersDto = {
  firstname: string;
  lastname: string;
  email_address: string;
  election_id: number;
};

export type UpdateVotersDto = {
  id: string;
  firstname: string;
  lastname: string;
  email_address: string;
};

export type ImportVotersByElectionDto = {
  electionIds: {
    from: number;
    to: number;
  };
};

export type ImportVotersByCSVDto = {
  election_id: number;
};

export type DisallowVotersDto = {
  voter_ids: number[];
  election_id: number;
};

export type AllowVotersDto = {
  voter_ids: number[];
  election_id: number;
};

export type RemoveVotersDto = {
  voter_ids: number[];
  election_id: number;
};

const url = "/api/v1/voter";

const votersServices = {
  async getAll(electionId: number, query: GetVotersDto) {
    return (
      await apiClient.get(
        `${url}/all/${electionId}/${transformParamsToUrl(query)}`
      )
    ).data;
  },
  async getById(id: string) {
    return (await apiClient.get(`${url}/${id}`)).data;
  },
  async getByVoterId(voterId: string) {
    return (await apiClient.get(`${url}/voter-id/${voterId}`)).data;
  },
  async isExistByVoterId(voterId: string) {
    return (await apiClient.get(`${url}/exist/voter-id/${voterId}`)).data;
  },
  async getByEmail(email: string) {
    return (await apiClient.get(`${url}/email/${email}`)).data;
  },
  async isExistByEmail(email: string) {
    return (await apiClient.get(`${url}/exist/email/${email}`)).data;
  },
  async getElectionVoters(election_id: string) {
    return (
      await apiClient.get(
        `${url}/election-voters/${transformParamsToUrl({ election_id })}`
      )
    ).data;
  },

  async create(body: CreateVotersDto) {
    const formData = new FormData();

    console.log("Body Test", body);

    formData.append("firstname", body.firstname);
    formData.append("lastname", body.lastname);
    formData.append("email_address", body.email_address);
    formData.append("election_id", body.election_id.toString());

    return (
      await apiClient.post(`${url}`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
    ).data;
  },

  async update(body: UpdateVotersDto) {
    const formData = new FormData();

    formData.append("id", body.id);
    formData.append("firstname", body.firstname);
    formData.append("lastname", body.lastname);
    formData.append("email_address", body.email_address);

    return (
      await apiClient.put(`${url}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  },

  async exportToCsv(_electionId: number) {
    return (
      await apiClient.post(`${url}/export-to-csv/${_electionId}`, undefined, {
        responseType: "blob",
      })
    ).data;
  },
  async importByElection(_dto: ImportVotersByElectionDto) {
    return (await apiClient.post(`${url}/import-by-election`, _dto)).data;
  },
  async importByCsv(_file: any, _dto: ImportVotersByCSVDto) {
    const formData = new FormData();

    formData.append("voters-csv", _file);
    formData.append("election_id", _dto.election_id.toString());

    return (
      await apiClient.post(`${url}/import-by-csv`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  },
  async allow(_dto: AllowVotersDto) {
    return (await apiClient.post(`${url}/allow/`, _dto)).data;
  },
  async disallow(_dto: DisallowVotersDto) {
    return (await apiClient.post(`${url}/disallow/`, _dto)).data;
  },
  async remove(_dto: DisallowVotersDto) {
    return (await apiClient.post(`${url}/remove/`, _dto)).data;
  },
};

export default votersServices;
