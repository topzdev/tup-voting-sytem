<template>
  <v-row>
    <v-col cols="12">
      <h2>Positions and Candidates</h2>
    </v-col>
    <v-col v-for="item in positions" :key="item.id" cols="12">
      <h3>{{ item.title }}</h3>
      <p>{{ item.description }}</p>
      <v-row v-if="item.candidates && item.candidates.length">
        <v-col
          v-for="candidate in item.candidates"
          :key="candidate.id"
          cols="4"
        >
          <candidate-card :candidate="candidate"></candidate-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Position } from "@/types/app";
import CandidateCard from "@/components/cards/CandidateCard.vue";

export default Vue.extend({
  components: {
    CandidateCard,
  },
  props: {
    positions: {
      type: Array,
    } as PropOptions<Position[]>,
  },
});
</script>

<style>
</style>