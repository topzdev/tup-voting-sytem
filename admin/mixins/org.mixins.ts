import Vue from "vue";

const orgMixin = Vue.extend({
  computed: {
    organizationId(): number {
      return parseInt(this.$route.params.organizationId);
    },
    createPage(): string {
      return `/manage/organization/${this.organizationId}/election/create`;
    },
  },
});

export default orgMixin;
