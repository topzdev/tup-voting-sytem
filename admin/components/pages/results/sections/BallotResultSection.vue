<template>
  <v-row>
    <v-col v-for="item in results" :key="item.id" cols="12">
      <result-card :result="item" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import ResultCard from "@/components/pages/results/cards/ResultCard.vue";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import {
  ElectionResults,
  ElectionResultWithWinner,
} from "@/services/results.service";
import { PropOptions } from "vue";
import mixins from "vue-typed-mixins";

export default mixins(manageElectionMixins).extend({
  props: {
    results: {
      type: Array,
    } as PropOptions<ElectionResultWithWinner[]>,
  },

  components: {
    ResultCard,
  },
});
</script>

<style>
</style>