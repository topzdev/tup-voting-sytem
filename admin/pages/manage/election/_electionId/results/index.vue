<template>
  <span>
    <page-bars title="Election Results">
      <v-btn class="ml-auto" large outlined color="primary">Reload</v-btn>
      <v-btn class="ml-2" color="primary" large>Download Results</v-btn>
    </page-bars>

    <v-container>
      <winner-section />
    </v-container>
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

  data() {
    return {
      winners: [{}],
    };
  },
});
</script>

<style>
</style>