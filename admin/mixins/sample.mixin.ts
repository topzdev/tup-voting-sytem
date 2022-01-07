import Vue from "vue";

const sampleMixin = Vue.extend({
  data() {
    return {
      pagePath: "sample",
    };
  },
  methods: {
    createSampleRoute() {
      this.$router.push(`${this.pagePath}/create`);
    },
    editSampleRoute(id: string) {
      this.$router.push(`${this.pagePath}/${id}/edit`);
    },
    importSampleRoute() {
      this.$router.push(`${this.pagePath}/import`);
    },
  },
});

export default sampleMixin;
