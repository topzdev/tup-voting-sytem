import Vue from "vue";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "./manage-election.mixins";

const votersMixin = mixins(manageElectionMixins).extend({
  data() {
    return {
      pagePath: "voters",
    };
  },

  methods: {
    refreshTable() {
      this.$router.push({
        query: {
          refresh: "1",
        },
      });
    },
  },
});

export default votersMixin;
