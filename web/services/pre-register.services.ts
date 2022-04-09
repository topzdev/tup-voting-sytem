import apiClient from ".";

const url = "/api/v1/pre-register";

export type PreRegisterVoterInfo = {
  code: string;
  election_id: number;
};

const preRegisterServices = {
  async getElectionBySlug(slug: string) {
    return (await apiClient.get(`${url}/election/${slug}`)).data;
  },

  async isRegistered({ election_id, email_address }) {
    return (
      await apiClient.post(`${url}/is-registered/`, {
        election_id,
        email_address,
      })
    ).data;
  },

  async preRegister(voter_info: PreRegisterVoterInfo) {
    return (await apiClient.post(`${url}/pre-register/`, voter_info)).data;
  },

  async voterInfo(code: string) {
    return (await apiClient.post(`${url}/voter-info`, { code })).data;
  },
};

export default preRegisterServices;
