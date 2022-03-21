import { getAccessorType, mutationTree, actionTree } from "typed-vuex";
import { Context } from "@nuxt/types";
import VuexPersistence from "vuex-persist";

import * as ballot from "./ballot";

export const state = () => ({
  email: "",
});

type RootState = ReturnType<typeof state>;

export const getters = {
  email: (state: RootState) => state.email,
  fullEmail: (state: RootState) => state.email,
};

export const mutations = mutationTree(state, {
  setEmail(state, newValue: string) {
    state.email = newValue;
  },

  initialiseStore() {
    console.log("initialised");
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    async resetEmail({ commit }) {
      commit("setEmail", "a@a.com");
    },

    async nuxtServerInit(_vuexContext, nuxtContext: Context) {},
  }
);

export const accessorType = getAccessorType({
  actions,
  getters,
  mutations,
  state,
  modules: {
    ballot,
  },
});
