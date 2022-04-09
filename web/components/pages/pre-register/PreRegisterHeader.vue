<template>
  <v-row v-if="election" class="no-gutters">
    <v-col class="d-flex justify-center mb-3" md="12">
      <v-avatar size="80">
        <app-image :size="80" :src="election.logo" :alt="election.title" />
      </v-avatar>
    </v-col>
    <v-col>
      <h1 class="headline text-center w-100" style="word-break: break-word">
        {{ election.title }} <br />
        <span class="font-weight-bold">Election Pre Registration</span>
      </h1>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import { Election } from "../../../types/app";

export default mixins().extend({
  props: {
    election: {
      type: Object,
    } as PropOptions<Election>,
  },
});
</script>

<style>
</style>