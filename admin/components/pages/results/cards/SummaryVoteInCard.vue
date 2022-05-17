<template>
  <v-card color="primary lighten-1" dark>
    <v-card-title class="py-2">
      <v-icon class="mr-1">mdi-vote</v-icon> Votes In
    </v-card-title>
    <v-card-text class="pt-1 pb-3">
      <div>
        <h2 class="mb-0 white--text">{{ other_info.votedCount }}</h2>
        <p class="mb-0 subtitle">
          out of {{ other_info.votersCount }} registered voters
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { ResultIssue, ResultOtherInfo } from "@/services/results.service";

export default Vue.extend({
  props: {
    other_info: {
      type: Object,
    } as PropOptions<ResultOtherInfo>,
  },
});
</script>

<style>
</style>