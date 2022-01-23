import Vue from "vue";
import { Election, Organization } from "../types/app";

const ballotMixins = Vue.extend({
  computed: {
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

    electionOrganization(): Organization | null {
      return this.$accessor.ballot.organization;
    },

    organizationId(): Organization["id"] | null {
      return this.electionOrganization ? this.electionOrganization.id : null;
    },
  },

  methods: {
    ballotRules(min_selected: number, max_selected: number) {
      let rules: string[] = [];

      if (min_selected <= 0) {
        rules.push("Voters <b>are not</b>required to select an option.");
      } else {
        rules.push(
          `Voters are required to select a <b>minimum of ${min_selected}</b> candidate option(s)`
        );
      }

      rules.push(`Voter can select  <b>only ${max_selected}</b> option`);

      return rules;
    },
  },
});

export default ballotMixins;
