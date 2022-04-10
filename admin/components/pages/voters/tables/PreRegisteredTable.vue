<template>
  <v-card>
    <v-card-title>
      <v-row align="center">
        <v-col cols="4">
          <v-text-field
            v-model="table.search"
            append-icon="mdi-magnify"
            label="Search voter by Voter ID, First Name or Last Name"
            single-line
            hide-details
            outlined
          ></v-text-field>
        </v-col>

        <v-col cols="auto" class="ml-auto" v-if="showGrantButton">
          <v-btn color="primary" large :loading="loading" @click="grantVoters"
            >Grant Voters ({{ selectedLength }})</v-btn
          >
        </v-col>
      </v-row>
    </v-card-title>

    <v-data-table
      v-model="table.selected"
      :show-select="true"
      :single-select="false"
      :loading="table.loading"
      :headers="headers"
      :items="table.items"
      :server-items-length="table.pagination.total"
      :page.sync="table.pagination.page"
      :items-per-page.sync="table.pagination.perPage"
      :footer-props="{
        'items-per-page-options': table.pagination.itemsPerPageOptions,
      }"
    >
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import debounce from "@/helpers/debounce";
import mixins from "vue-typed-mixins";
import votersMixin from "~/mixins/voters.mixin";
import votersServices, { Voters } from "~/services/voters.service";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import restrictionsMixin from "@/mixins/restrictions.mixin";

export default mixins(
  manageElectionMixins,
  votersMixin,
  restrictionsMixin
).extend({
  data() {
    return {
      loading: false,

      table: {
        loading: false,

        pagination: {
          page: 1,
          perPage: 10,
          total: 0,
          itemsPerPageOptions: [5, 10, 15, 20],
        },
        search: "",
        items: [],
        selected: [] as Voters[],
        multiSort: true,
        sortDesc: [true, true, true, true, true],
        sortBy: ["voted", "username", "email_address", "firstname", "lastname"],
      },
    };
  },

  computed: {
    showGrantButton(): boolean {
      return this.selectedLength > 0;
    },

    selectedLength(): number {
      return this.table.selected.length;
    },
    headers() {
      return this.filterByStatus([
        {
          text: "Voter ID",
          value: "username",
        },
        {
          text: "Email Address",
          value: "email_address",
        },
        {
          text: "Firstname",
          value: "firstname",
        },
        {
          text: "Lastname",
          value: "lastname",
        },
      ]);
    },
  },

  watch: {
    async ["table.pagination.page"](val) {
      await this.fetchItems();
    },
    ["table.search"]: debounce(async function () {
      // @ts-ignore
      await this.fetchItems();
    }, 500),
  },

  methods: {
    async grantVoters() {
      if (!this.electionId) return;

      this.loading = true;

      const voterIds = this.table.selected.map((item) => item.id);

      const result = await votersServices.grantPreRegister(
        this.electionId,
        voterIds
      );

      await this.fetchItems();

      this.loading = false;
    },

    async fetchItems() {
      this.table.loading = true;

      if (!this.electionId) return;

      try {
        const result = await votersServices.getAllPreRegistered(
          this.electionId,
          {
            page: this.table.pagination.page,
            take: this.table.pagination.perPage,
            search: this.table.search,
          }
        );

        console.log(result);

        this.table.items = result.items;
        this.table.pagination.total = result.totalCount;
        this.table.loading = false;
        this.table.selected = [];
      } catch (error) {}
    },
  },

  fetchOnServer: false,
  async fetch() {
    await this.fetchItems();
  },
});
</script>

<style>
</style>