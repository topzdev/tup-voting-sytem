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

const _fetchElection = async (commit: any, id: any) => {
  const result = await electionServices.getById(id);

  commit("setElection", result);
  commit("setOrganization", result.organization);
};

export const actions = actionTree(
  { state, mutations },
  {
    async fetchElection({ commit, state }, id: number) {
      if (state.election) {
        if (state.election.id !== id) {
          await _fetchElection(commit, id);
        }
      } else {
        await _fetchElection(commit, id);
      }
    },

    async reFetchElection({ commit }, id: number) {
      await _fetchElection(commit, id);
    },
  }
);
