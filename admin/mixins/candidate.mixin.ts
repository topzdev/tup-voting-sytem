import Vue from "vue";

const candidateMixin = Vue.extend({
  data() {
    return {
      pagePath: "candidates",
    };
  },
  methods: {
    createCandidateRoute() {
      return `${this.pagePath}/create`;
    },
    editCandidateRoute(id: string) {
      return `${this.pagePath}/${id}/edit`;
    },
  },
});

export default candidateMixin;
