import { actionTree, mutationTree } from "typed-vuex";
import resultServices, {
  ElectionResults,
  ElectionResultWithWinner,
} from "@/services/results.service";
import blobDownloader from "~/helpers/blob-downloader.helper";

export const state = () => ({
  results: [] as ElectionResultWithWinner[],
});

export const mutations = mutationTree(state, {
  setResult(state, payload) {
    state.results = payload;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchResults({ commit, rootState }) {
      const electionId = this.app.$accessor.manageElection.election?.id;

      if (!electionId) return;

      const response = await resultServices.getResults(electionId);

      commit("setResult", response);
    },
    async downloadVoteAudit() {
      const election = this.app.$accessor.manageElection.election;
      const electionId = election?.id;

      if (!election || !electionId) return;
      const data = await resultServices.exportVoteAudit(electionId);

      blobDownloader(
        data,
        `${election.title}-vote-audit-${Date.now()}`.toLowerCase(),
        "text/csv"
      );
    },

    async downloadElectionResults() {
      const election = this.app.$accessor.manageElection.election;
      const electionId = election?.id;

      if (!electionId || !election) return;
      const data = await resultServices.exportResults(electionId);

      blobDownloader(
        data,
        `${election?.title}-results-${Date.now()}`.toLowerCase(),
        "text/csv"
      );
    },
  }
);
