import { actionTree, mutationTree } from "typed-vuex";
import votingServices, {
  ElectionErrorMessage,
} from "@/services/voting.services";
import { Election, Organization } from "../types/app";

export const state = () => ({
  error: {
    election: null as ElectionErrorMessage | null,
  },
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
  setElectionError(state, _payload) {
    state.error.election = _payload;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchElection({ commit }, slug: string) {
      const result = await votingServices.getElectionBySlug(slug);

      console.log(result);

      if (result.election) {
        commit("setElection", result.election);
        commit("setOrganization", result.election.organization);
      }
      commit("setElectionError", result.error);
    },
  }
);
