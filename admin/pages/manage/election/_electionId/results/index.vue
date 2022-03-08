<template>
  <span>
    <page-bars title="Election Results"> </page-bars>

    <v-container> </v-container>
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import PageBars from "~/components/bars/PageBars.vue";
import pageStatus from "@/configs/page-status.config";
export default Vue.extend({
  components: {
    PageBars,
  },
  meta: {
    status: pageStatus.results,
  },
});
</script>

<style>
</style>