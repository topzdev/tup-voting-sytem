import { RouteConfig } from "@nuxt/types/config/router";
import mixins from "vue-typed-mixins";
import pageConfig from "../configs/pages.config";
import { User } from "../services/user.service";
import { SettingLink } from "./settings.mixin";

const editUserMixin = mixins().extend({
  created() {
    console.log(this.$route);
  },

  computed: {
    user(): User | null {
      return this.$accessor.user.user;
    },

    userId(): number {
      return parseInt(this.$route.params.userId);
    },

    pages(): Record<string, SettingLink> {
      return {
        general: pageConfig.users().general(this.userId),
        changeRole: pageConfig.users().changeRole(this.userId),
        resetPassword: pageConfig.users().resetPassword(this.userId),
        disabledAccount: pageConfig.users().disableAccount(this.userId),
        removeAccount: pageConfig.users().removeAccount(this.userId),
      };
    },
  },
});

export default editUserMixin;
