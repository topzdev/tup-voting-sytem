<template>
  <v-row>
    <v-col class="d-flex align-center text-center flex-column" md="12">
      <h2
        class="display-2 font-weight-bold text--primary mx-auto"
        v-html="title"
      ></h2>

      <p v-if="body" class="subtitle-1 text--secondary mt-2" v-html="body"></p>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Election } from "@/types/app";
import { ElectionErrorMessage } from "@/services/voting.services";

export default Vue.extend({
  props: {
    electionError: {
      type: [Object, String],
      required: true,
    } as PropOptions<ElectionErrorMessage>,
  },

  computed: {
    title(): string {
      return typeof this.electionError === "object"
        ? this.electionError.title
        : this.electionError;
    },

    body(): string {
      return typeof this.electionError === "object"
        ? this.electionError.body
        : "";
    },
  },
});
</script>

<style>
</style>