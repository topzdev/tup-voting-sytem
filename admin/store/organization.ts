import { actionTree, mutationTree } from "typed-vuex";
import organizationServices, {
  Organization,
} from "../services/organization.service";

export const state = () => ({
  organization: null as Organization | null,
});

export const mutations = mutationTree(state, {
  setOrganization(state, payload) {
    state.organization = payload;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchOrganization({ commit }, id) {
      const response = await organizationServices.getById(id);
      commit("setOrganization", response);
    },

    async refreshOrganization({ commit, state }) {
      if (!state.organization) return;
      const response = await organizationServices.getById(
        state.organization.id
      );
      commit("setOrganization", response);
    },

    async clearOrganization({ commit }) {
      commit("setOrganization", null);
    },
  }
);
