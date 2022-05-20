import Vue from "vue";
import { Election, Organization } from "../types/app";

const ballotMixins = Vue.extend({
  computed: {
    pagePath() {
      return `/vote/${this.$route.params.slug}/`;
    },

    electionId(): Election["id"] | null {
      return this.election ? this.election.id : null;
    },

    electionError() {
      return this.$accessor.ballot.error.election;
    },

    election(): Election | null {
      return this.$accessor.ballot.election;
    },

    ballotItems() {
      return this.$accessor.ballot.items;
    },

    reviewItems() {
      return this.$accessor.ballot.reviewItems;
    },

    electionOrganization(): Organization | null {
      return this.$accessor.ballot.organization;
    },

    organizationId(): Organization["id"] | null {
      return this.electionOrganization ? this.electionOrganization.id : null;
    },

    ballotErrors() {
      return this.$accessor.ballot.ballotErrors;
    },

    ballotReceipt() {
      return this.$accessor.ballot.ballotReceipt;
    },
  },

  methods: {
    gotoBallot() {
      this.$router.push(`${this.pagePath}ballot`);
    },

    gotoReview() {
      this.$router.push(`${this.pagePath}ballot/review`);
    },

    gotoFinal() {
      this.$router.push(`${this.pagePath}ballot/final`);
    },

    ballotLogout() {
      this.$auth.logout();
      this.$router.push(this.pagePath);
      this.$accessor.ballot.resetBallot();
      return;
    },
    ballotRules(min_selected: number, max_selected: number) {
      let rules: string[] = [];

      if (min_selected <= 0) {
        rules.push("You are not required to select any canddiate(s)");
      } else {
        rules.push(
          `You are required to vote atleast <b>${min_selected}</b> candidate(s)`
        );
      }

      rules.push(
        `You are allowed to select up to ${max_selected} candidate(s)`
      );

      return rules;
    },
  },
});

export default ballotMixins;
