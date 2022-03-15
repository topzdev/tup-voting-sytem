import { actionTree, mutationTree, getterTree } from "typed-vuex";
import votingServices, {
  ElectionErrorMessage,
} from "@/services/voting.services";
import {
  BallotError,
  BallotItem,
  Candidate,
  Election,
  Organization,
  Position,
} from "../types/app";

export const state = () => ({
  error: {
    election: null as ElectionErrorMessage | null,
  },
  ballotErrors: [],
  election: null as Election | null,
  organization: null as Organization | null,
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

    async vote({ commit, state }, candidate: Candidate) {
      let current = state.votes;
      console.log("-------");
      console.log("Candidaite", candidate);

      if (
        !state.votes.filter((item) => {
          console.log(
            "Item",
            item,
            "ITEM ID: ",
            item.id,
            "CANDIDATE ID:",
            candidate.id
          );
          return item.id === candidate.id;
        }).length
      ) {
        console.log("If");
        commit("setVote", [...state.votes, candidate]);
      } else {
        console.log("Else");
        commit(
          "setVote",
          state.votes.filter((item) => item.id !== candidate.id)
        );
      }

      this.app.$accessor.ballot.ballotErrorChecker();
    },

    async ballotErrorChecker({ commit, state }) {
      let ballotErrors: BallotError[] = [];

      console.log("Error Checking..");

      state.items.forEach((_position) => {
        let errors: string[] = [];

        // get the count of current votes casted on specific position
        let totalVotesOfPosition = state.votes.filter(
          (_vote) => _vote.position_id === _position.id
        ).length;

        console.log(
          "Total Votes: ",
          totalVotesOfPosition,
          "Min Selected: ",
          _position.min_selected,

          totalVotesOfPosition < _position.min_selected
        );

        if (totalVotesOfPosition < _position.min_selected) {
          errors.push(
            `Must select atleast ${_position.min_selected} candidates`
          );
        }

        if (totalVotesOfPosition > _position.max_selected) {
          errors.push(`The max select is ${_position.max_selected} `);
        }

        if (errors.length) {
          ballotErrors.push({
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
  }
);
