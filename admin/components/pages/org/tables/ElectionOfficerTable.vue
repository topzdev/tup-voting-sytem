  <template>
  <v-data-table
    style="width: 100%"
    :loading.sync="table.loading"
    :headers.sync="table.headers"
    :items.sync="table.items"
    :server-items-length.sync="table.pagination.total"
    :page.sync="table.pagination.page"
    :items-per-page.sync="table.pagination.perPage"
    :footer-props="{
      'items-per-page-options': table.pagination.itemsPerPageOptions,
    }"
  >
    <template v-slot:item.actions="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="enableOfficer(item)">
            <v-icon> mdi-account-cancel </v-icon>
          </v-btn>
        </template>
        <span>{{ item.disabled ? "Enable" : "Disable" }} Officer</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="resetPassword(item)">
            <v-icon> mdi-account-reactivate-outline </v-icon>
          </v-btn>
        </template>
        <span>Reset Password</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="editOfficer(item)">
            <v-icon> mdi-pencil </v-icon>
          </v-btn>
        </template>
        <span>Edit Information</span>
      </v-tooltip>

      <!-- <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="deleteOfficer(item)">
            <v-icon> mdi-delete </v-icon>
          </v-btn>
        </template>
        <span>Delete Officer</span>
      </v-tooltip> -->
    </template>
  </v-data-table>
</template>

<script lang="ts">
import manageOrganizationMixin from "@/mixins/manage-organization.mixins";
import electionOfficerServices from "@/services/election-officer.service";
import mixins from "vue-typed-mixins";

export default mixins(manageOrganizationMixin).extend({
  props: {
    table: Object,
    editOfficer: Function,
    enableOfficer: Function,
    resetPassword: Function,
    deleteOfficer: Function,
  },
});
</script>

<style>
</style>
