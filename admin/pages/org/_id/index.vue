<template>
  <span>
    <page-bars backTo="/" backTooltip="Back to Organization" :title="pageTitle">
      <v-btn
        v-if="itemsCount"
        color="primary"
        class="ml-auto"
        :to="createPage"
        large
        >New Election</v-btn
      >
    </page-bars>
    <account-container>
      <v-row no-gutters>
        <v-col class="mx-auto text-center" md="8">
          <div v-if="$fetchState.pending">Loading...</div>
          <div v-else-if="$fetchState.error">Something went wrong</div>
          <election-empty v-else-if="!itemsCount" />
        </v-col>

        <v-col
          cols="12"
          v-if="!$fetchState.pending && !$fetchState.error && itemsCount"
        >
          <v-row no-gutters>
            <v-col cols="12">
              <v-row>
                <v-col cols="5">
                  <v-text-field
                    v-model="search"
                    :loading="loading"
                    append-icon="mdi-magnify"
                    label="Search organization by title or ticker"
                    single-line
                    hide-details
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col> </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <election-list :items="items" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </account-container>
  </span>
</template>

<script>
import Vue from "vue";
import authMixins from "@/mixins/auth.mixins";
import orgMixins from "@/mixins/org.mixins";
import PageBars from "@/components/bars/PageBars.vue";
import AccountContainer from "@/components/containers/AccountContainer.vue";

import ElectionEmpty from "@/components/pages/election/ElectionEmpty.vue";
import ElectionList from "@/components/pages/election/ElectionList.vue";
import debounce from "@/helpers/debounce";
import electionServices from "../../../services/election.service";
import organizationServices, {
  Organization,
} from "@/services/organization.service";

export default Vue.extend({
  auth: true,
  layout: "account",
  mixins: [authMixins, orgMixins],
  components: {
    PageBars,
    ElectionList,
    ElectionEmpty,
    AccountContainer,
  },
  head: {
    title: "Dashboard",
  },

  data() {
    return {
      loading: true,
      items: [],
      totalCount: 0,
      itemsCount: 0,
      search: "",
      organization: null,
    };
  },
  fetchOnServer: false,
  async fetch() {
    await this.fetchOrganization();
    await this.fetchItems();
  },

  watch: {
    search: debounce(async function () {
      // @ts-ignore
      await this.fetchItems();
    }, 500),
  },

  computed: {
    pageTitle() {
      if (!this.organization) return "Election";
      return `${this.organization.ticker} Election`;
    },
  },

  methods: {
    async fetchOrganization() {
      try {
        const result = await organizationServices.getById(this.organizationId);
        this.organization = result;
      } catch (error) {
        console.log(error);
      }
    },

    async fetchItems() {
      this.loading = true;
      try {
        const result = await electionServices.getAll({
          search: this.search,
          orgId: this.organizationId,
        });

        this.items = result.items;
        this.totalCount = result.totalCount;
        this.itemsCount = result.itemsCount;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
});
</script>