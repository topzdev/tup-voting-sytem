import { actionTree, mutationTree } from "typed-vuex";
import electionServices, {
  Election,
  ElectionWithUrl,
} from "@/services/election.service";
import { Organization } from "../services/organization.service";
import pageConfig from "../configs/pages.config";
const defaultSnackbar = {
  show: false,
  message: "",
  color: "",
  timeout: -1,
};

export const state = () => ({
  election: null as ElectionWithUrl | null,
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

const _fetchElection = async (commit: any, id: number) => {
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

    async refreshElection({ commit, state }) {
      if (state.election) await _fetchElection(commit, state.election.id);
    },

    async deleteElection({ commit, state }) {
      const election = state.election;
      const organization = state.organization;

      if (!election || !organization) return;

      const result = await electionServices.delete(election.id);
      this.$router.push(pageConfig.organization(organization.id).this().route);
    },
  }
);
