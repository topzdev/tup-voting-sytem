<template>
  <span>
    <page-bars>
      <h2 class="headline-6 font-weight-medium">Organization</h2>
      <v-btn
        color="primary"
        class="ml-auto"
        to="/manage/organization/create"
        large
        >New Organization</v-btn
      >
    </page-bars>
    <account-container>
      <v-row no-gutters>
        <v-col class="mx-auto text-center" md="8">
          <div v-if="$fetchState.pending">Loading...</div>
          <div v-else-if="$fetchState.error">Something went wrong</div>
          <organization-empty v-else-if="!totalCount" />
        </v-col>

        <v-col cols="12" v-if="!$fetchState.pending && !$fetchState.error">
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
              <organization-list :items="items" :total-count="totalCount" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </account-container>
  </span>
</template>
<script lang="ts">
import Vue from "vue";
import authMixins from "@/mixins/auth.mixins";
import PageBars from "@/components/bars/PageBars.vue";
import AccountContainer from "@/components/containers/AccountContainer.vue";
import OrganizationList from "@/components/pages/org/OrganizationList.vue";
import organizationServices from "@/services/organization.service";

import OrganizationEmpty from "@/components/pages/org/OrganizationEmpty.vue";
import debounce from "@/helpers/debounce";

export default Vue.extend({
  auth: true,
  layout: "account",
  mixins: [authMixins],
  components: {
    PageBars,
    OrganizationList,
    OrganizationEmpty,
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
      itemCount: 0,
      search: "",
    };
  },
  fetchOnServer: false,
  async fetch() {
    await this.fetchItems();
  },

  watch: {
    search: debounce(async function () {
      // @ts-ignore
      await this.fetchItems();
    }, 500),
  },

  methods: {
    async fetchOrganization() {},

    async fetchItems() {
      this.loading = true;
      try {
        const result = await organizationServices.getAll({
          search: this.search,
        });
        this.items = result.items;
        this.totalCount = result.totalCount;
        this.itemCount = result.itemCount;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
});
</script>