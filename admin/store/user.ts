import { actionTree, mutationTree } from "typed-vuex";
import userServices, { User } from "../services/user.service";

export const state = () => ({
  user: null as User | null,
});

export const mutations = mutationTree(state, {
  setUser(state, payload) {
    state.user = payload;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchUser({ commit }, id) {
      const response = await userServices.getById(id);
      commit("setUser", response);
    },

    async refetchUser({ commit, state }) {
      if (!state.user) return;
      const response = await userServices.getById(state.user.id);
      commit("setUser", response);
    },

    async clearUser({ commit }) {
      commit("setUser", null);
    },
  }
);
