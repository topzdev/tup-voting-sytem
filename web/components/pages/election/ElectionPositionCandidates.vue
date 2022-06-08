<template>
  <v-row>
    <v-col class="text-subtitle-2 text-md-h6 font-weight-black" cols="12">
      <h2>Positions and Candidates</h2>
    </v-col>
    <template v-if="positions && positions.length">
      <v-col
        v-for="item in positions"
        :key="item.id"
        cols="12"
        class="pt-0 mb-lg-5 mb-5"
      >
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
        <v-row>
          <template v-if="item.candidates && item.candidates.length">
            <v-col
              v-for="candidate in item.candidates"
              :key="candidate.id"
              cols="12"
              sm="6"
              md="6"
              lg="4"
            >
              <candidate-card :candidate="candidate"></candidate-card>
            </v-col>
          </template>
          <template v-else>
            <v-col class="py-0">
              <p class="text--secondary">
                No candidate available in this position
              </p></v-col
            >
          </template>
        </v-row>
      </v-col>
    </template>
    <template v-else>
      <v-col class="py-0">
        <p class="text--secondary">
          No candidate available in this position
        </p></v-col
      >
    </template>
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