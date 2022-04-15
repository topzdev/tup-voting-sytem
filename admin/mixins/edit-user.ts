import { RouteConfig } from "@nuxt/types/config/router";
import mixins from "vue-typed-mixins";
import pageConfig from "../configs/pages.config";
import { SettingLink } from "./settings.mixin";

const editUserMixin = mixins().extend({
  created() {
    console.log(this.$route);
  },

  computed: {
    userId(): number {
      return parseInt(this.$route.params.userId);
    },

    pages(): Record<string, SettingLink> {
      return {
        general: {
          icon: "mdi-account-outline",
          title: "User Information",
          to: this.generalRoute(),
        },
        resetPassword: {
          icon: "mdi-lock-reset",
          title: "Reset Password",
          to: this.resetPasswordRoute(),
        },
        disabledAccount: {
          icon: "mdi-account-off",
          title: "Enable/Disable Account",
          to: this.disableAccountRoute(),
        },
        removeAccount: {
          icon: "mdi-account-remove",
          title: "Remove Account",
          to: this.disableAccountRoute(),
        },
      };
    },
  },

  methods: {
    generalRoute() {
      return pageConfig.users().general(this.userId);
    },
    resetPasswordRoute() {
      return pageConfig.users().resetPassword(this.userId);
    },
    disableAccountRoute() {
      return pageConfig.users().disableAccount(this.userId);
    },
  },
});

export default editUserMixin;
