<template>
  <span>
    <page-bars
      :backTo="backTo"
      backTooltip="Back to Organization"
      :title="pageBarTitle"
      :logo="pageBarLogo"
    >
      <v-btn
        v-if="rolesAllowed(this.pageRoles.organization.manage)"
        class="ml-auto mr-2"
        text
        large
        :to="organizationEditRoute"
        >Manage</v-btn
      >
      <v-btn
        v-if="rolesAllowed(this.pageRoles.organization.create)"
        color="primary"
        :to="createElectionRoute"
        large
        >New Election</v-btn
      >
    </page-bars>
    <account-container>
      <election-list />
    </account-container>
  </span>
</template>

<script lang="ts">
import PageBars from "@/components/bars/PageBars.vue";
import AccountContainer from "@/components/containers/AccountContainer.vue";
import ElectionList from "@/components/pages/election/ElectionList.vue";
import pageConfig from "@/configs/pages.config";
import authMixins from "@/mixins/auth.mixins";
import orgMixin from "@/mixins/org.mixins";
import rolesRestriction from "@/mixins/roles-restriction.mixin";
import mixins from "vue-typed-mixins";

export default mixins(orgMixin, authMixins, rolesRestriction).extend({
  auth: true,
  layout: "account",
  components: {
    PageBars,
    ElectionList,
    AccountContainer,
  },
  head: {
    title: "Dashboard",
  },

  async fetch() {
    try {
      await this.$accessor.organization.fetchOrganization(this.organizationId);
    } catch (error) {
      throw new Error("Error");
    }
  },

  computed: {
    organizationEditRoute(): string {
      return pageConfig.organization(this.organizationId).manageInfo().route;
    },
    createElectionRoute(): string {
      return pageConfig.organization(this.organizationId).createElection()
        .route;
    },

    pageBarTitle(): string {
      if (!this.organization) return "Elections";
      return `${this.organization.ticker} Elections`;
    },
    pageBarLogo(): any {
      if (!this.organization) return null;
      return this.organization.logo;
    },
    backTo() {
      return this.rolesAllowed(this.pageRoles.organization.button.back)
        ? "/"
        : null;
    },
  },
});
</script>