<template>
  <v-row class="no-gutters">
    <v-col class="d-flex justify-center mb-3" md="12">
      <v-avatar size="80">
        <app-image :size="80" :src="election.logo" :alt="election.title" />
      </v-avatar>
    </v-col>
    <v-col>
      <h1 class="headline text-center w-100" style="word-break: break-word">
        {{ election.title }} <br />
        <span class="font-weight-bold">Election</span>
      </h1>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Election } from "@/types/app";

export default Vue.extend({
  props: {
    election: {
      type: Object,
      required: true,
    } as PropOptions<Election>,
  },
});
</script>

<style>
</style>