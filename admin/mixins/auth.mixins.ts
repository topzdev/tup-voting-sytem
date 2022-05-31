import Vue from "vue";
import { UserRoles } from "../services/auth.service";
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
      allowedRoles: UserRoles[] | UserRoles
    ) {
      let message = "";
      let callname = "";
      let username = this.$auth.user?.username as string;

      const currentUserRole = this.$auth.user?.role;

      switch (currentUserRole) {
        case "sadmin" || "admin":
          callname = "Administrator";
          break;

        case "elec_ofc":
          callname = "Election Officer";
          break;
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
        allowedRoles,
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
