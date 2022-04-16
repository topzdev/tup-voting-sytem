import { RouteConfig } from "@nuxt/types/config/router";
import mixins from "vue-typed-mixins";
import pageConfig from "../configs/pages.config";
import { User } from "../services/user.service";
import { SettingLink } from "./settings.mixin";

const myAccountMixin = mixins().extend({
  computed: {
    account() {
      return this.$accessor.myAccount.account;
    },

    pages(): Record<string, SettingLink> {
      return {
        myAccount: pageConfig.myaccount().this(),
        changePassword: pageConfig.myaccount().changePassword(),
      };
    },
  },
});

export default myAccountMixin;
