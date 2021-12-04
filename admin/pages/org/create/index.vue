<template>
  <page-center>
    <v-row>
      <v-col class="mx-auto text-center" md="4">
        <organization-empty v-if="!items.length" />
        <organization-list v-else />
      </v-col>
    </v-row>
  </page-center>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

import PageCenter from "@/components/utils/PageCenter.vue";
export default Vue.extend({
  components: {
    PageCenter,
  },

  data() {
    return {};
  },
});
</script>

<style>
</style>