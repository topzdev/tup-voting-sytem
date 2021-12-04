<template>
  <span>
    <h1 class="headline-6 font-weight-medium">Organizations</h1>

    <v-row no-gutters class="my-4">
      <template v-for="org in items">
        <v-col :key="org.id" cols="12" class="mb-3">
          <organization-card :org="org" />
        </v-col>
      </template>
    </v-row>

    <v-btn color="primary" large block class="mt-1">
      Create Organization
    </v-btn>
  </span>
</template>

<script>
import { organizationDummy } from "@/services/organization.service";
import OrganizationCard from "./OrganizationCard.vue";

export default {
  components: {
    OrganizationCard,
  },
  computed: {
    items() {
      return organizationDummy;
    },
  },
};
</script>

<style>
</style>