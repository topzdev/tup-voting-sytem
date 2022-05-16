<template>
  <v-card>
    <v-card-title> {{ result.title }} </v-card-title>

    <v-card-text>
      <v-row>
        <v-col v-if="winners" cols="12" class="pt-0">
          <result-winner-section :winners="winners" />

          <v-divider></v-divider>
        </v-col>

        <v-col cols="6">
          <template v-if="result.isTieOccured && !result.isTieResolved">
            <result-tied-candidate-table
              :position="result"
              :candidates="parsedCandidates"
            />
          </template>
          <template v-else>
            <result-candidate-table
              :position="result"
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
import Vue, { PropOptions } from "vue";
import {
  ElectionResult,
  ResultCandidate,
  CandidateTieResult,
  ElectionResultWithWinner,
} from "@/services/results.service";
import ResultCandidateTable from "@/components/pages/results/tables/ResultCandidateTable.vue";
import ResultTiedCandidateTable from "@/components/pages/results/tables/ResultTiedCandidateTable.vue";
import ResultCandidateChart from "@/components/pages/results/charts/ResultCandidateCharts.vue";
import ResultWinnerSection from "@/components/pages/results/sections/ResultWinnerSection.vue";
export default Vue.extend({
  props: {
    result: {
      type: Object,
    } as PropOptions<ElectionResultWithWinner>,
  },
  components: {
    ResultCandidateTable,
    ResultCandidateChart,
    ResultWinnerSection,
    ResultTiedCandidateTable,
  },

  computed: {
    candidates(): ElectionResultWithWinner["candidates"] {
      return this.result.candidates;
    },

    parsedCandidates(): ElectionResultWithWinner["candidates"] {
      let candidates: ResultCandidate[] = [];

      this.result.candidates.forEach(function (item) {
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

    winners(): ElectionResultWithWinner["winners"] {
      return this.result.winners;
    },
  },
});
</script>

<style>
</style>