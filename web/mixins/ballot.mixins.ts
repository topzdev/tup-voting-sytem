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

    electionOrganization(): Organization | null {
      return this.$accessor.ballot.organization;
    },

    organizationId(): Organization["id"] | null {
      return this.electionOrganization ? this.electionOrganization.id : null;
    },
  },
});

export default ballotMixins;
