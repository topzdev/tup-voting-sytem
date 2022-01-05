import Vue from "vue";

const votersMixin = Vue.extend({
  data() {
    return {
      pagePath: "voters",
    };
  },
  methods: {
    createVoterRoute() {
      this.$router.push(`${this.pagePath}/create`);
    },
    editVoterRoute(id: string) {
      this.$router.push(`${this.pagePath}/${id}/edit`);
    },
    importVoterRoute() {
      this.$router.push(`${this.pagePath}/import`);
    },
  },
});

export default votersMixin;
