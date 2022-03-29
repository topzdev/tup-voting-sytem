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
          <result-candidate-table :candidates="candidates" />
        </v-col>

        <v-col cols="6">
          <result-candidate-chart :results="candidates" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { ElectionResult } from "@/services/results.service";
import ResultCandidateTable from "@/components/pages/results/tables/ResultCandidateTable.vue";
import ResultCandidateChart from "@/components/pages/results/charts/ResultCandidateCharts.vue";
import ResultWinnerSection from "@/components/pages/results/sections/ResultWinnerSection.vue";
export default Vue.extend({
  props: {
    result: {
      type: Object,
    } as PropOptions<ElectionResult>,
  },
  components: {
    ResultCandidateTable,
    ResultCandidateChart,
    ResultWinnerSection,
  },

  computed: {
    candidates(): ElectionResult["candidates"] {
      return this.result.candidates;
    },
    winners(): ElectionResult["winners"] {
      return this.result.winners;
    },
  },
});
</script>

<style>
</style>