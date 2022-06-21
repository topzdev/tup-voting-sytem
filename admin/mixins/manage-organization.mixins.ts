import mixins from "vue-typed-mixins";
import pageConfig from "../configs/pages.config";
import orgMixin from "./org.mixins";
import { SettingLink } from "./settings.mixin";

const manageOrganizationMixin = mixins(orgMixin).extend({
  computed: {
    pages(): Record<string, SettingLink> {
      return {
        info: pageConfig.organization(this.organizationId).manageInfo(),
        termsAndCondition: pageConfig
          .organization(this.organizationId)
          .termsAndCondition(),
        deleteOrganization: pageConfig
          .organization(this.organizationId)
          .deleteOrganization(),
      };
    },
  },
});

export default manageOrganizationMixin;
