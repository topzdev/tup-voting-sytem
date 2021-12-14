<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex flex-row align-center">
        <h1 class="headline-6 font-weight-medium mr-auto">Manage Users</h1>

        <v-btn large color="primary" @click="modals.createUser.show = true">
          Add User
        </v-btn>
      </v-col>

      <v-col>
        <v-card tile :loading="loading">
          <v-card-title>
            <users-table
              :items="table.items"
              :total="table.total"
              :refetch="fetchItems"
            ></users-table>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <user-create-dialog
      :fetch-func="fetchItems"
      :is-open.sync="modals.createUser.show"
    />
  </v-container>
</template>

<script>
import UsersTable from "../../../components/pages/users/UsersTable.vue";
import Vue from "vue";
import UserCreateDialog from "../../../components/pages/users/UserCreateDialog.vue";
import userServices from "../../../services/user.service";
export default Vue.extend({
  components: { UsersTable, UserCreateDialog },

  data() {
    return {
      loading: false,

      table: {
        items: [],
        total: 0,
      },

      modals: {
        createUser: {
          show: false,
        },
      },
    };
  },
  fetchOnServer: false,

  methods: {
    async fetchItems({ page, perPage, search }) {
      this.loading = true;
      const result = await userServices.getAll({
        page: page,
        take: perPage,
        search: search,
      });

      console.log(result);

      this.table.items = result.items;
      this.table.total = result.total;
      this.loading = false;
    },
  },

  async fetch() {
    await this.fetchItems({ page: 1, perPage: 10 });
  },
});
</script>

<style>
</style>