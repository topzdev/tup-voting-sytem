<template>
  <span>
    <page-bars
      backTo="/"
      backTooltip="Back to Organization"
      :title="pageBarTitle"
      :logo="pageBarLogo"
    >
      <v-btn class="ml-auto mr-2" text large :to="organizationEditRoute"
        >Manage</v-btn
      >
      <v-btn color="primary" :to="createElectionRoute" large
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
import organizationServices, {
  Organization,
} from "@/services/organization.service";
import mixins from "vue-typed-mixins";
import orgMixin from "@/mixins/org.mixins";

export default mixins(orgMixin, authMixins).extend({
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

  fetchOnServer: false,
  async fetch() {
    await this.fetchOrganization();
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
  },

  methods: {
    async fetchOrganization() {
      await this.$accessor.organization.fetchOrganization(this.organizationId);
    },
  },
});
</script>