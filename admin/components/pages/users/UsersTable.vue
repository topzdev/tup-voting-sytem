<template>
  <v-card tile>
    <v-card-title>
      <v-row>
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
      </v-row>
    </v-card-title>
    <v-data-table
      :loading="table.loading"
      :headers="table.headers"
      :items="table.items"
      :server-items-length="table.pagination.total"
      :page.sync="table.pagination.page"
      :footer-props="{
        'items-per-page-options': table.pagination.itemsPerPageOptions,
      }"
    >
      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon> mdi-pencil </v-icon>
            </v-btn>
          </template>
          <span>Edit User</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon> mdi-form-textbox-password </v-icon>
            </v-btn>
          </template>
          <span>Change Password</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import userServices from "../../../services/user.service";

export default Vue.extend({
  data() {
    return {
      table: {
        loading: false,
        headers: [
          {
            text: "Firstname",
            value: "firstname",
          },
          {
            text: "Lastname",
            value: "lastname",
          },
          {
            text: "Username",
            value: "username",
          },
          {
            text: "Role",
            value: "role",
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
  },

  methods: {
    async fetchItems() {
      this.table.loading = true;
      const result = await userServices.getAll({
        page: this.table.pagination.page,
        take: this.table.pagination.perPage,
        search: this.table.search,
      });

      this.table.items = result.items;
      this.table.pagination.total = result.count;
      this.table.loading = false;
    },
  },

  async fetch() {
    await this.fetchItems();
  },
});
</script>

<style>
</style>