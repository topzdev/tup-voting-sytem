<template>
  <v-card color="success lighten-1" style="height: 100%" dark>
    <v-card-title class="py-2">
      <v-icon class="mr-1">mdi-post</v-icon> Publish Results
    </v-card-title>
    <v-card-text class="d-flex align-center pt-1 pb-3">
      <div>
        <h2 class="mb-0 white--text">2 issue(s) left</h2>
        <p class="mb-0 subtitle">Fix Issue first before publishing</p>
      </div>

      <v-btn class="ml-auto mt-n10" text>Publish</v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

export default Vue.extend({});
</script>

<style>
</style>