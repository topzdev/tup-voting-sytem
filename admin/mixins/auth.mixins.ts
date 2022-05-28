import Vue from "vue";
import { ElectionOfficer } from "../services/election-officer.service";
import { AuthUser } from "../services/user.service";
import {
  AuthenticationDialogConfig,
  AuthenticationDialogType,
} from "../store/system";

const authMixin = Vue.extend({
  methods: {
    async logout() {
      await this.$auth.logout();
      this.$nuxt.$router.push("/login");
    },

    async systemAuthentication(
      _config: Omit<
        AuthenticationDialogConfig,
        "type" | "allowedRole" | "show"
      >,
      type: AuthenticationDialogType = "default",
      allowedRole: "super-admin" | "admin" | "all" = "all"
    ) {
      await this.$auth.fetchUser();

      let message = "";
      let callname = "";
      let username = this.$auth.user?.username as string;

      if (this.$auth.user?.role === "sadmin") {
        callname = "Super Admin";
      } else {
        callname = "Admin";
      }

      if (type === "current-only-password") {
        message = `Hi ${callname} <b>${username}</b>, Please enter your password to continue.`;
      }

      this.$accessor.system.showAuthenticationDialog({
        ..._config,
        type,
        default: {
          usernameOrEmail: username,
        },
        message,
        allowedRole,
        show: true,
      });
    },
  },

  computed: {
    user() {
      return this.$auth.user as AuthUser;
    },

    electionOfficer(): ElectionOfficer | undefined {
      return this.user.election_officer;
    },

    fullname(): string {
      if (!this.$auth.loggedIn) return "";

      const { firstname, lastname } = this.$auth.user as any;

      return `${firstname} ${lastname}`;
    },

    initials(): string {
      const allNames = this.fullname.trim().split(" ");
      const initials = allNames.reduce((acc, curr, index) => {
        if (index === 0 || index === allNames.length - 1) {
          acc = `${acc}${curr.charAt(0).toUpperCase()}`;
        }
        return acc;
      }, "");

      return initials;
    },
  },
});

export default authMixin;
