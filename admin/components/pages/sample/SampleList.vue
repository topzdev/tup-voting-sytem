<template>
  <span>
    <v-row no-gutters class="my-4">
      <template v-if="items.length">
        <v-col v-for="item in items" :key="item.id" cols="12" class="mb-3">
          <sample-card :data="item" />
        </v-col>
      </template>
      <v-col v-else class="text-center"> No item found </v-col>
    </v-row>
  </span>
</template>

<script>
import Vue, { PropOptions } from "vue";
import SampleCard from "./cards/SampleCard.vue";

export default Vue.extend({
  components: {
    SampleCard,
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