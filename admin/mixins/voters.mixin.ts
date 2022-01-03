import Vue from "vue";

const votersMixin = Vue.extend({
  computed: {},
  methods: {
    createVoterRoute() {
      this.$router.push("voters/create");
    },
    editVoterRoute(id: string) {
      this.$router.push(`voters/${id}/edit`);
    },
  },
});

export default votersMixin;
