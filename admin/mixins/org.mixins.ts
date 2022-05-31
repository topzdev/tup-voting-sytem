import Vue from "vue";
import { Organization } from "../services/organization.service";

const orgMixin = Vue.extend({
  computed: {
    organizationId(): number {
      return parseInt(this.$route.params.organizationId);
    },
    organization(): Organization | null {
      const organization = this.$accessor.organization.organization;
      return organization;
    },
  },
});

export default orgMixin;
