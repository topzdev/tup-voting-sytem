import { actionTree, mutationTree } from "typed-vuex";
import electionServices, { Election } from "@/services/election.service";
import { Organization } from "../services/organization.service";
const defaultSnackbar = {
  show: false,
  message: "",
  color: "",
  timeout: -1,
};

export const state = () => ({
  election: null as Election | null,
  organization: null as Organization | null,
});

export const mutations = mutationTree(state, {
  setElection(state, _payload) {
    state.election = _payload;
  },
  setOrganization(state, _payload) {
    state.organization = _payload;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchElection({ commit }, id: string) {
      if (id == "NaN" || id == "undefined" || id === undefined) {
        throw Error("Please provide proper Election ID");
      }

      const result = await electionServices.getById(id);

      commit("setElection", result);
      commit("setOrganization", result.organization);
    },
  }
);
