import Vue from "vue";
import pageRoles from "../configs/page-roles";
import { UserRoles } from "../services/auth.service";

const roleRestrictionsMixin = Vue.extend({
  methods: {
    rolesAllowed(allowedStatus: UserRoles[] | string[]) {
      console.log(this.userRole, allowedStatus);

      if (!this.userRole) return false;
      return !!allowedStatus.filter((item) => item === this.userRole).length;
    },
  },

  computed: {
    userRole(): UserRoles | undefined {
      if (!this.$auth.user) return undefined;
      return this.$auth.user?.role as UserRoles;
    },

    pageRoles() {
      return pageRoles;
    },
  },
});

export default roleRestrictionsMixin;
