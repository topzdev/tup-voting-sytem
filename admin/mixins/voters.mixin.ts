import Vue from "vue";
import manageElectionMixins from "./manage-election.mixins";

const votersMixin = Vue.extend({
  mixins: [manageElectionMixins],
  computed: {},
  methods: {
    editVoterRoute(id: string) {
      this.$router.push(`voters/${id}/edit`);
    },
  },
});

export default votersMixin;
