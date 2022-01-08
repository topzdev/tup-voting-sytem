<template>
  <span>
    <v-row no-gutters class="my-4">
      <template v-if="items.length">
        <v-col v-for="item in items" :key="item.id" cols="12" class="mb-3">
          <party-card :data="item" />
        </v-col>
      </template>
      <v-col v-else class="text-center"> No item found </v-col>
    </v-row>
  </span>
</template>

<script>
import Vue, { PropOptions } from "vue";
import PartyCard from "./cards/PartyCard.vue";

export default Vue.extend({
  components: {
    PartyCard,
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