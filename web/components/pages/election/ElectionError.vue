<template>
  <v-row>
    <v-col class="d-flex align-center text-center flex-column" md="12">
      <h1
        class="display-2 font-weight-bold text--primary mx-auto"
        v-html="electionError.title"
      >
        {{ electionError.title }}
      </h1>

      <p class="subtitle-1 text--secondary mt-2" v-html="electionError.body">
        {{ electionError.body }}
      </p>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Election } from "@/types/app";
import { ElectionErrorMessage } from "../../../services/voting.services";

export default Vue.extend({
  props: {
    electionError: {
      type: Object,
      required: true,
    } as PropOptions<ElectionErrorMessage>,
  },
});
</script>

<style>
</style>