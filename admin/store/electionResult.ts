import resultServices, {
  ResultIssue,
  ResultOtherInfo,
  ResultPositionsWithWinner,
} from "@/services/results.service";
import { actionTree, mutationTree } from "typed-vuex";
import blobDownloader from "~/helpers/blob-downloader.helper";

export const state = () => ({
  positions: [] as ResultPositionsWithWinner[],
  issues: undefined as ResultIssue | undefined,
  other_info: undefined as ResultOtherInfo | undefined,
});

export const mutations = mutationTree(state, {
  setIssues(state, payload) {
    state.issues = payload;
  },
  setPositions(state, payload) {
    state.positions = payload;
  },
  setOtherInfo(state, payload) {
    state.other_info = payload;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchResults({ commit, rootState }) {
      const electionId = this.app.$accessor.manageElection.election?.id;

      if (!electionId) return;

      const response = await resultServices.getResults(electionId);

      if (response.issues) {
        commit("setIssues", response.issues);
      }
      if (response.positions) {
        commit("setPositions", response.positions);
      }
      if (response.other_info) {
        commit("setOtherInfo", response.other_info);
      }
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
