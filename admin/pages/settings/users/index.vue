<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex flex-row align-center">
        <h1 class="headline-6 font-weight-medium mr-auto">Manage Users</h1>

        <v-btn large color="primary"> Add User </v-btn>
      </v-col>

      <v-col>
        <users-table></users-table>
      </v-col>
    </v-row>

    <user-create-dialog :open.sync="userCreateDialog.open" />
  </v-container>
</template>

<script lang="ts">
import UsersTable from "../../../components/pages/users/UsersTable.vue";
import Vue from "vue";
import UserCreateDialog from "../../../components/pages/users/UserCreateDialog.vue";
export default Vue.extend({
  components: { UsersTable, UserCreateDialog },

  data() {
    return {
      userCreateDialog: {
        open: true,
      },
    };
  },
});
</script>

<style>
</style>