<template>
  <v-card color="warning lighten-1" dark>
    <v-card-title class="py-2">
      <v-icon class="mr-1">mdi-alert-circle-outline</v-icon> Issues
    </v-card-title>
    <v-card-text class="d-flex align-center pt-1 pb-3">
      <div>
        <h2 class="mb-0 white--text">{{ issues.totalResolved }}</h2>
        <p class="mb-0 subtitle">
          out of {{ issues.totalIssues }} Issue(s) Resolved
        </p>
      </div>

      <v-btn class="ml-auto mt-n10" text>View Issue(s)</v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { ResultIssue } from "@/services/results.service";

export default Vue.extend({
  props: {
    issues: {
      type: Object,
    } as PropOptions<ResultIssue>,
  },
});
</script>

<style>
</style>