<template>
  <span v-if="!$fetchState.pending">
    <page-bars back title="Manage Organization"> </page-bars>

    <v-container v-if="!$fetchState.pending && !$fetchState.error">
      <v-row>
        <v-col class="shrink">
          <manage-organization-sidebar />
        </v-col>
        <v-col cols="12" lg="8" xl="6" class="grow">
          <nuxt-child />
        </v-col>
      </v-row>
    </v-container>
  </span>
</template>

<script lang="ts">
import PageBars from "@/components/bars/PageBars.vue";
import ManageOrganizationSidebar from "@/components/pages/org/sidebars/ManageOrganizationSidebar.vue";
import mixins from "vue-typed-mixins";
import orgMixin from "@/mixins/org.mixins";
import { UserRolesValue } from "@/types/roles";
export default mixins(orgMixin).extend({
  middleware: ["roles"],
  meta: {
    allowedRoles: ["sadmin", "admin"] as UserRolesValue[],
  },
  components: {
    PageBars,
    ManageOrganizationSidebar,
  },

  async fetch() {
    await this.$accessor.organization.fetchOrganization(this.organizationId);
  },
});
</script>

<style>
</style>