<template>
  <span>
    <h1 class="headline-6 font-weight-medium">Organizations ({{ count }})</h1>

    <v-row no-gutters class="my-4">
      <template v-for="org in items">
        <v-col :key="org.id" cols="12" class="mb-3">
          <organization-card :org="org" />
        </v-col>
      </template>
    </v-row>

    <v-btn color="primary" large block class="mt-1" to="org/create">
      Create Organization
    </v-btn>
  </span>
</template>

<script>
import Vue, { PropOptions } from "vue";
import { organizationDummy } from "@/services/organization.service";
import OrganizationCard from "./OrganizationCard.vue";

export default Vue.extend({
  components: {
    OrganizationCard,
  },

  props: {
    items: Array,
    count: {
      default: 0,
      types: Number,
    },
  },
});
</script>

<style>
</style>