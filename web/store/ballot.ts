import { actionTree, mutationTree } from "typed-vuex";
import votingServices, {
  ElectionErrorMessage,
} from "@/services/voting.services";
import { BallotItem, Candidate, Election, Organization } from "../types/app";

export const state = () => ({
  error: {
    election: null as ElectionErrorMessage | null,
  },
  election: null as Election | null,
  organization: null as Organization | null,
  items: [] as BallotItem[],
  candidate: null as Candidate | null,
  dialog: {
    candidate: true,
  },
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

  setBallotItems(state, _payload) {
    state.items = _payload;
  },

  setCandidate(state, _payload) {
    state.candidate = _payload;
  },

  setCandidateDialog(state, _payload) {
    state.dialog.candidate = _payload;
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

    async fetchBallot({ commit, state }) {
      if (!state.election) return;

      const result = await votingServices.getBallot(state.election.id);

      commit("setBallotItems", result);
    },

    async toggleCandidateDialog({ commit }, show: boolean) {
      commit("setCandidateDialog", show);
    },

    async fetchCandidate({ commit }, candidate_id: number) {
      const result = await votingServices.getCandidates(candidate_id);
      commit("setCandidate", result);
    },
  }
);
