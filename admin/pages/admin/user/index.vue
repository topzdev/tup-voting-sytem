<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex flex-row align-center">
        <h1 class="headline-6 font-weight-medium mr-auto">Manage Users</h1>

        <v-btn large color="primary" :to="gotoCreateRoute"> Add User </v-btn>
      </v-col>

      <v-col>
        <v-card tile :loading="loading">
          <v-card-title>
            <users-table></users-table>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UsersTable from "~/components/pages/users/tables/UsersTable.vue";
import pageConfig from "@/configs/pages.config";
import Vue from "vue";
import UserCreateDialog from "~/components/pages/users/dialogs/UserCreateDialog.vue";
export default Vue.extend({
  components: { UsersTable, UserCreateDialog },

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    gotoCreateRoute() {
      return pageConfig.users().create().route;
    },
  },
});
</script>

<style>
</style>