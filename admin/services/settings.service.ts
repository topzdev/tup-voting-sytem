import apiClient from ".";
import { Election } from "./election.service";

const url = "/api/v1/settings";

type UpdateDatesDto = Pick<Election, "start_date" | "close_date">;

type UpdateGeneralDto = Pick<Election, "slug" | "title" | "description"> & {
  logo: File | null;
};

const settingsServices = {
  async updateGeneral(election_id: Election["id"], body: UpdateGeneralDto) {
    return (
      await apiClient.put(`${url}/general/`, { id: election_id, ...body })
    ).data;
  },

  async updateDates(election_id: Election["id"], body: UpdateDatesDto) {
    return (await apiClient.put(`${url}/date/`, { id: election_id, ...body }))
      .data;
  },

  async archive(election_id: Election["id"]) {
    return (await apiClient.put(`${url}/archive/${election_id}`)).data;
  },
  async close(election_id: Election["id"]) {
    return (await apiClient.put(`${url}/close/${election_id}`)).data;
  },
};

export default settingsServices;
