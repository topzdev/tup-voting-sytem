import { actionTree, mutationTree, getterTree } from "typed-vuex";
import votingServices, {
  ElectionErrorMessage,
} from "@/services/voting.services";
import {
  BallotError,
  BallotItem,
  BallotReceipt,
  BallotVote,
  Candidate,
  Election,
  Organization,
  Position,
} from "../types/app";

export const state = () => ({
  error: {
    election: null as ElectionErrorMessage | null,
  },
  ballotReceipt: {
    ip: "::1",
    ua: "PostmanRuntime/7.29.0",
    receipt_id: "TUPELECT-3-WDAVEMJRJ",
    created_at: "2022-03-20T11:01:35.836Z",
    election_title: "TUP Tite Annual Election",
    id: 3,
  } as BallotReceipt | null,
  ballotErrors: [] as BallotError[],

  // election: {} as any,
  election: null as Election | null,
  organization: null as Organization | null,
  // items: [] as any[],
  items: [] as BallotItem[],
  candidate: null as Candidate | null,
  dialog: {
    candidate: true,
  },

  votes: [] as Candidate[],
});

export const getters = getterTree(state, {
  reviewItems: (state) =>
    state.items.map((_ballotItem) => ({
      ..._ballotItem,
      candidates: state.votes.filter(
        (_voteItem) => _voteItem.position_id === _ballotItem.id
      ),
    })),
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

  setVote(state, _payload) {
    state.votes = _payload;
  },

  setBallotErrors(state, _payload) {
    state.ballotErrors = _payload;
  },

  setBallotReceipt(state, _payload) {
    state.ballotReceipt = _payload;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchElection({ commit }, slug: string) {
      const result = await votingServices.getElectionBySlug(slug);

      if (result.election) {
        commit("setElection", result.election);
        commit("setOrganization", result.election.organization);
      }
      commit("setElectionError", result.error);
    },

    async fetchBallot({ commit, state }) {
      if (!state.election) return;

      try {
        const result = await votingServices.getBallot(state.election.id);

        commit("setBallotItems", result);
      } catch (err: any) {
        const error = err.response.data.error.message;
        console.error(error);
        commit("setElectionError", error);
      }
    },

    async submitBallot({ commit, state }) {
      try {
        if (!state.election || !state?.election.id || state.ballotErrors.length)
          return;

        const ballotVote: BallotVote[] = state.votes.map((item) => ({
          position_id: item.position_id,
          candidate_id: item.id,
        }));

        const result = await votingServices.submitBallot({
          election_id: state.election.id,
          votes: ballotVote,
        });

        commit("setBallotReceipt", result);
      } catch (err: any) {
        const error = err.response.data.error.message;
        console.error(error);
        commit("setElectionError", error);
      }
    },

    async toggleCandidateDialog({ commit }, show: boolean) {
      commit("setCandidateDialog", show);
    },

    async fetchCandidate({ commit }, candidate_id: number) {
      const result = await votingServices.getCandidates(candidate_id);
      commit("setCandidate", result);
    },

    async vote({ commit, state }, candidate: Candidate) {
      let current = state.votes;

      if (
        !state.votes.filter((item) => {
          return item.id === candidate.id;
        }).length
      ) {
        commit("setVote", [...state.votes, candidate]);
      } else {
        commit(
          "setVote",
          state.votes.filter((item) => item.id !== candidate.id)
        );
      }

      this.app.$accessor.ballot.ballotErrorChecker();
    },

    async ballotErrorChecker({ commit, state }) {
      let ballotErrors: BallotError[] = [];

      state.items.forEach((_position) => {
        let errors: string[] = [];

        // get the count of current votes casted on specific position

        let totalVotesOfPosition = state.votes.filter(
          (_vote) => _vote.position_id === _position.id
        ).length;

        if (totalVotesOfPosition < _position.min_selected) {
          errors.push(
            `You must select atleast ${_position.min_selected} candidates`
          );
        }

        if (totalVotesOfPosition > _position.max_selected) {
          errors.push(
            `You can select up to ${_position.max_selected} candidates`
          );
        }

        if (errors.length) {
          ballotErrors.push({
            title: _position.title,
            position_id: _position.id,
            messages: errors,
            totalVotes: totalVotesOfPosition,
            min_selected: _position.min_selected,
            max_selected: _position.max_selected,
          });
        }
      });

      commit("setBallotErrors", ballotErrors);
    },

    resetBallot({ commit }) {
      commit("setBallotReceipt", null);
      commit("setElectionError", null);
      commit("setVote", []);
    },
  }
);
