<template>
  <span>
    <v-row no-gutters class="my-4">
      <template v-if="items.length">
        <v-col v-for="item in items" :key="item.id" cols="12" class="mb-3">
          <organization-card :org="item" />
        </v-col>
      </template>
      <v-col v-else class="text-center"> No items found </v-col>
    </v-row>
  </span>
</template>

<script>
import Vue, { PropOptions } from "vue";
import { organizationDummy } from "@/services/organization.service";
import OrganizationCard from "./cards/OrganizationCard.vue";

export default Vue.extend({
  components: {
    OrganizationCard,
  },

  props: {
    items: Array,
    totalCount: {
      default: 0,
      types: Number,
    },
  },
});
</script>

<style>
</style>