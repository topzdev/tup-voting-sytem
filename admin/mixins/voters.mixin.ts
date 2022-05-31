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
    preRegisterRoute() {
      this.$router.push(`${this.manageElectionRoute}/pre-registered`);
    },

    createVoterRoute() {
      this.$router.push(`${this.pagePath}/create`);
    },
    editVoterRoute(id: string) {
      this.$router.push(`${this.pagePath}/${id}/edit`);
    },
    importVoterRoute() {
      this.$router.push(`${this.pagePath}/import`);
    },

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
