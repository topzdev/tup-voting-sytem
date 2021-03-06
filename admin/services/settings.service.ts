import apiClient from ".";
import { Election } from "./election.service";

const url = "/api/v1/settings";

type UpdateDatesDto = Pick<Election, "start_date" | "close_date">;

type UpdateGeneralDto = Pick<Election, "slug" | "title" | "description"> & {
  logo: File | null;
};

const settingsServices = {
  async updateGeneral(election_id: Election["id"], body: UpdateGeneralDto) {
    const formData = new FormData();

    console.log("Body Test", body);

    formData.append("title", body.title);
    formData.append("slug", body.slug);
    formData.append("description", body.description);
    if (body.logo) formData.append("logo", body.logo);

    return (
      await apiClient.put(`${url}/general/${election_id}`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
    ).data;
  },

  async updateDates(election_id: Election["id"], body: UpdateDatesDto) {
    return (await apiClient.put(`${url}/date/${election_id}`, body)).data;
  },

  async archive(election_id: Election["id"]) {
    return (await apiClient.put(`${url}/archive/${election_id}`)).data;
  },
  async closeElection(election_id: Election["id"]) {
    return (await apiClient.put(`${url}/closeElection/${election_id}`)).data;
  },

  async sendCredentialsEmail(
    election_id: Election["id"],
    voters_ids: number[] | "all"
  ) {
    return (
      await apiClient.post(`${url}/voters-credentials/${election_id}`, {
        voters_ids,
      })
    ).data;
  },

  async electionPublicity(
    election_id: Election["id"],
    is_public: Election["is_public"]
  ) {
    return (
      await apiClient.put(`${url}/isElectionPublic/${election_id}`, {
        is_public,
      })
    ).data;
  },

  async sendElectionHasLaunched(election_id: Election["id"]) {
    return (await apiClient.post(`${url}/election-has-launched/${election_id}`))
      .data;
  },

  async sendElectionHasEnded(election_id: Election["id"]) {
    return (await apiClient.post(`${url}/election-has-ended/${election_id}`))
      .data;
  },

  async electionTallyPublicity(
    election_id: Election["id"],
    is_tally_public: Election["is_tally_public"]
  ) {
    return (
      await apiClient.put(`${url}/isElectionTallyPublic/${election_id}`, {
        is_tally_public,
      })
    ).data;
  },
  async allowElectionPreRegistration(
    election_id: Election["id"],
    allow_pre_register: Election["allow_pre_register"]
  ) {
    return (
      await apiClient.put(`${url}/allow-pre-register/${election_id}`, {
        allow_pre_register,
      })
    ).data;
  },
};

export default settingsServices;
