import transformParamsToUrl from "@/helpers/paramsToUrl.helpers";
import apiClient from ".";
import { Election } from "./election.service";
import { DataTimestamp } from "./voters.service";

type PartyLogo = {
  id: number;
  public_id: number;
  url: string;
  service: string;
};

type PartyCoverPhoto = {
  id: number;
  public_id: number;
  url: string;
  service: string;
};

export type Party = {
  id: number;
  description: string;
  ticker: string;
  title: string;
  election_id: number;
  election: Election;
  logo: PartyLogo | null;
  cover_photo: PartyCoverPhoto;
  archive: boolean;
} & DataTimestamp;

export type GetPartyReturn = {
  items: Party[];
  itemsCount: number;
  totalCount: number;
};

export interface GetPartyDto {
  search?: string;
  order?: any;
  page?: number;
  take?: number;
}

export type CreatePartyDto = {
  ticker: string;
  title: string;
  description: string;
  election_id: number;
  logo: File;
  cover: File;
};

export type UpdatePartyDto = {
  id: number;
  ticker: string;
  title: string;
  description: string;
  election_id: number;
  logo: File;
  cover: File;
};

const url = "/api/v1/party";

const partyServices = {
  async getAll(
    election_id: number,
    query: GetPartyDto
  ): Promise<GetPartyReturn> {
    return (
      await apiClient.get(
        `${url}/all/${election_id}${transformParamsToUrl(query)}`
      )
    ).data;
  },
  async getById(id: number): Promise<Party> {
    return (await apiClient.get(`${url}/${id}`)).data;
  },

  async create(body: CreatePartyDto): Promise<Party> {
    const formData = new FormData();

    console.log("Body Test", body);

    formData.append("title", body.title);
    formData.append("ticker", body.ticker);
    formData.append("election_id", body.election_id.toString());
    formData.append("description", body.description);
    formData.append("logo", body.logo);
    formData.append("cover", body.cover);

    return (
      await apiClient.post(`${url}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  },

  async update(body: UpdatePartyDto): Promise<boolean> {
    const formData = new FormData();

    formData.append("id", body.id.toString());
    formData.append("title", body.title);
    formData.append("ticker", body.ticker);
    formData.append("election_id", body.election_id.toString());
    formData.append("description", body.description);

    formData.append("logo", body.logo);
    formData.append("cover", body.cover);
    return (
      await apiClient.put(`${url}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  },

  async restore(id: number): Promise<boolean> {
    return (await apiClient.put(`${url}/restore/${id}`)).data;
  },

  async delete(id: number): Promise<boolean> {
    return (await apiClient.delete(`${url}/${id}`)).data;
  },
};

export default partyServices;
