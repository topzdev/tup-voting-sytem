<template>
  <v-card>
    <v-card-title>
      <v-row align="center">
        <v-col cols="4">
          <v-text-field
            v-model="table.search"
            append-icon="mdi-magnify"
            label="Search user by Firstname, Lastname or Username"
            single-line
            hide-details
            outlined
          ></v-text-field>
        </v-col>

        <v-col cols="auto" class="ml-auto">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon large v-bind="attrs" v-on="on" @click="fetchItems">
                <v-icon> mdi-refresh </v-icon>
              </v-btn>
            </template>
            <span>Refresh Table</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card-title>

    <v-data-table
      :loading="table.loading"
      :headers="table.headers"
      :items="table.items"
      :server-items-length="table.pagination.total"
      :page.sync="table.pagination.page"
      :items-per-page.sync="table.pagination.perPage"
      :footer-props="{
        'items-per-page-options': table.pagination.itemsPerPageOptions,
      }"
    >
      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              @click="editVoterRoute(item.id)"
            >
              <v-icon> mdi-pencil </v-icon>
            </v-btn>
          </template>
          <span>Edit Voter</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import debounce from "@/helpers/debounce";
import mixins from "vue-typed-mixins";
import votersMixin from "~/mixins/voters.mixin";
import votersServices from "~/services/voters.service";
import manageElectionMixins from "../../../../mixins/manage-election.mixins";

export default mixins(manageElectionMixins, votersMixin).extend({
  data() {
    return {
      table: {
        loading: false,
        headers: [
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
          {
            text: "Action",
            value: "actions",
          },
        ],
        pagination: {
          page: 1,
          perPage: 10,
          total: 0,
          itemsPerPageOptions: [5, 10, 15, 20],
        },
        search: "",
        items: [],
      },
    };
  },

  watch: {
    async ["table.paginations.page"](val) {
      await this.fetchItems();
    },
    ["table.search"]: debounce(async function () {
      // @ts-ignore
      await this.fetchItems();
    }, 500),
  },

  methods: {
    async fetchItems() {
      this.table.loading = true;

      if (!this.electionId) return;

      const result = await votersServices.getAll(this.electionId, {
        page: this.table.pagination.page,
        take: this.table.pagination.perPage,
        search: this.table.search,
      });

      console.log(result);

      this.table.items = result.items;
      this.table.pagination.total = result.totalCount;
      this.table.loading = false;
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