<template>
  <span v-if="!$fetchState.pending">
    <page-bars back title="Manage Organization"> </page-bars>

    <v-container v-if="!$fetchState.pending && !$fetchState.error">
      <v-row>
        <v-col class="shrink">
          <manage-organization-sidebar />
        </v-col>
        <v-col cols="6" class="grow">
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
export default mixins(orgMixin).extend({
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