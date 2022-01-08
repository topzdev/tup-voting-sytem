import Vue from "vue";

const candidateMixin = Vue.extend({
  data() {
    return {
      pagePath: "candidates",
    };
  },
  methods: {
    createCandidateRoute() {
      this.$router.push(`${this.pagePath}/create`);
    },
    editCandidateRoute(id: string) {
      this.$router.push(`${this.pagePath}/${id}/edit`);
    },
  },
});

export default candidateMixin;
