<template>
  <v-row>
    <v-col v-for="item in positions" :key="item.id" cols="12">
      <result-positions-card :position="item" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import ResultPositionsCard from "@/components/pages/results/cards/ResultPositionsCard.vue";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import { ResultPositionsWithWinner } from "@/services/results.service";
import { PropOptions } from "vue";
import mixins from "vue-typed-mixins";

export default mixins(manageElectionMixins).extend({
  props: {
    positions: {
      type: Array,
    } as PropOptions<ResultPositionsWithWinner[]>,
  },

  components: {
    ResultPositionsCard,
  },
});
</script>

<style>
</style>