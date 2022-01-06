import apiClient from ".";
import transformParamsToUrl from "@/helpers/paramsToUrl.helpers";
import { DataTimestamp } from "./voters.service";
import { Organization } from "./organization.service";
import { Election } from "./election.service";

export type GetPositionReturn = {
  items: Position[];
  itemsCount: number;
  totalCount: number;
};

export type Position = {
  election_id: number;
  id: number;
  title: string;
  description: string;
  max_selected: number;
  min_selected: number;
  election: Election;
  display_order: number | null;
} & DataTimestamp;

export interface GetPositionDto {
  search?: string;
  order?: any;
  page?: number;
  take?: number;
}

export type CreatePositionDto = {
  election_id: number;
  title: string;
  description: string;
  max_selected: number;
  min_selected: number;
};

export type UpdatePositionDto = {
  id: number;
  election_id: number;
  title: string;
  description: string;
  max_selected: number;
  min_selected: number;
};

export type ArragePositionDto = {
  election_id: number;
  displayOrder: {
    id: number;
    order: number;
  }[];
};

const url = "/api/v1/position";

const positionServices = {
  async getAll(
    election_id: number,
    query: GetPositionDto
  ): Promise<GetPositionReturn> {
    return (
      await apiClient.get(
        `${url}/all/${election_id}${transformParamsToUrl(query)}`
      )
    ).data;
  },
  async getById(id: number): Promise<Position> {
    return (await apiClient.get(`${url}/${id}`)).data;
  },

  async create(body: CreatePositionDto): Promise<Position> {
    const formData = new FormData();

    console.log("Body Test", body);

    formData.append("election_id", body.election_id.toString());
    formData.append("title", body.title);
    formData.append("description", body.description);
    formData.append("max_selected", body.max_selected.toString());
    formData.append("min_selected", body.min_selected.toString());

    return (
      await apiClient.post(`${url}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  },

  async update(body: UpdatePositionDto): Promise<boolean> {
    const formData = new FormData();

    formData.append("id", body.id.toString());
    formData.append("election_id", body.election_id.toString());
    formData.append("title", body.title);
    formData.append("description", body.description);
    formData.append("max_selected", body.max_selected.toString());
    formData.append("min_selected", body.min_selected.toString());

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

  async arrangePosition(body: ArragePositionDto): Promise<boolean> {
    return (await apiClient.put(`${url}/display-order/`, body)).data;
  },
};

export default positionServices;
