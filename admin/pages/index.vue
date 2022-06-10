<template>
  <span>
    <page-bars>
      <h2 class="headline-6 font-weight-medium">Organization</h2>
      <v-btn color="primary" class="ml-auto" :to="createOrgRoute" large
        >New Organization</v-btn
      >
    </page-bars>
    <account-container>
      <organization-list />
    </account-container>
  </span>
</template>
<script lang="ts">
import Vue from "vue";
import authMixins from "@/mixins/auth.mixins";
import PageBars from "@/components/bars/PageBars.vue";
import AccountContainer from "@/components/containers/AccountContainer.vue";
import OrganizationList from "@/components/pages/org/OrganizationList.vue";
import pageConfig from "../configs/pages.config";
import mixins from "vue-typed-mixins";
import pageRoles from "../configs/page-roles";
export default mixins(authMixins).extend({
  auth: true,
  layout: "account",
  mixins: [authMixins],
  middleware: ['roles'],

  meta: {
    rolesAllowed: pageRoles.admin.this,
  },

  validate({ $auth, redirect }) {
    if ($auth.loggedIn && $auth.user.election_officer) {
      redirect(
        pageConfig.election($auth.user.election_officer.election_id).this()
          .route
      );
    }

    return true;
  },

  components: {
    PageBars,
    AccountContainer,
    OrganizationList,
  },
  head: {
    title: "Dashboard",
  },

  computed: {
    createOrgRoute() {
      return pageConfig.organization().create().route;
    },
  },
});
</script>