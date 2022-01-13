<template>
  <span>
    <page-bars
      backTo="/"
      backTooltip="Back to Organization"
      :title="pageBarTitle"
      :logo="pageBarLogo"
    >
      <v-btn color="primary" class="ml-auto" :to="createPage" large
        >New Election</v-btn
      >
    </page-bars>
    <account-container>
      <election-list />
    </account-container>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import authMixins from "@/mixins/auth.mixins";
import orgMixins from "@/mixins/org.mixins";
import PageBars from "@/components/bars/PageBars.vue";
import AccountContainer from "@/components/containers/AccountContainer.vue";

import ElectionList from "@/components/pages/election/ElectionList.vue";
import debounce from "@/helpers/debounce";
import electionServices from "@/services/election.service";
import organizationServices, {
  Organization,
} from "@/services/organization.service";
import mixins from "vue-typed-mixins";

export default mixins(orgMixins, authMixins).extend({
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

  data() {
    return {
      organization: null as Organization | null,
    };
  },

  fetchOnServer: false,
  async fetch() {
    await this.fetchOrganization();
  },

  computed: {
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
      if (!this.organizationId) return;

      try {
        const result = await organizationServices.getById(
          this.organizationId.toString()
        );
        this.organization = result;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
</script>