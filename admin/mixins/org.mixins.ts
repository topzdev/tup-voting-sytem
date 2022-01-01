import Vue from "vue";

const orgMixin = Vue.extend({
  computed: {
    organizationId(): number {
      return parseInt(this.$route.params.id);
    },
    createPage(): string {
      return `/org/${this.organizationId}/create`;
    },
  },
});

export default orgMixin;
