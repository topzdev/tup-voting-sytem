import { actionTree, mutationTree } from "typed-vuex";
import userServices, { User } from "../services/user.service";

export const state = () => ({
  account: null as User | null,
});

export const mutations = mutationTree(state, {
  setAccount(state, payload) {
    state.account = payload;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchAccount({ commit }) {
      const response = await userServices.myAccount();
      commit("setAccount", response);
    },

    async clearAccount({ commit }) {
      commit("setAccount", null);
    },
  }
);
