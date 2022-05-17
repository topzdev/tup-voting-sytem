<template>
  <v-card>
    <v-card-title> {{ position.title }} </v-card-title>

    <v-card-text>
      <v-row>
        <v-col v-if="winners" cols="12" class="pt-0">
          <result-winner-section :winners="winners" />

          <v-divider></v-divider>
        </v-col>

        <v-col cols="6">
          <template v-if="position.isTieOccured && !position.isTieResolved">
            <result-tied-candidate-table
              :position="position"
              :candidates="parsedCandidates"
            />
          </template>
          <template v-else>
            <result-candidate-table
              :position="position"
              :candidates="parsedCandidates"
            />
          </template>
        </v-col>

        <v-col cols="6">
          <result-candidate-chart :results="parsedCandidates" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import ResultCandidateChart from "@/components/pages/results/charts/ResultCandidateCharts.vue";
import ResultWinnerSection from "@/components/pages/results/sections/ResultWinnerSection.vue";
import ResultCandidateTable from "@/components/pages/results/tables/ResultCandidateTable.vue";
import ResultTiedCandidateTable from "@/components/pages/results/tables/ResultTiedCandidateTable.vue";
import {
  CandidateTieResult,
  ResultCandidate,
  ResultPositionsWithWinner,
} from "@/services/results.service";
import Vue, { PropOptions } from "vue";
export default Vue.extend({
  props: {
    position: {
      type: Object,
    } as PropOptions<ResultPositionsWithWinner>,
  },
  components: {
    ResultCandidateTable,
    ResultCandidateChart,
    ResultWinnerSection,
    ResultTiedCandidateTable,
  },

  computed: {
    candidates(): ResultPositionsWithWinner["candidates"] {
      return this.position.candidates;
    },

    parsedCandidates(): ResultPositionsWithWinner["candidates"] {
      let candidates: ResultCandidate[] = [];

      this.position.candidates.forEach(function (item) {
        let tieItem = item as CandidateTieResult;
        if (tieItem.tie) {
          candidates = [
            ...candidates,
            ...tieItem.candidates.map((item) => ({ ...item, tie: true })),
          ];
        } else {
          candidates = [...candidates, item as ResultCandidate];
        }
      });

      return candidates;
    },

    winners(): ResultPositionsWithWinner["winners"] {
      return this.position.winners;
    },
  },
});
</script>

<style>
</style>