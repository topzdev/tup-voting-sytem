<template>
  <v-card>
    <v-card-title> {{ result.title }} </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="6">
          <result-candidate-table :candidates="candidates" />
        </v-col>

        <v-col cols="6">
          <!-- <result-candidate-chart /> -->
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

export default Vue.extend({
  props: {
    result: {
      type: Object,
    } as PropOptions<ElectionResult>,
  },
  components: {
    ResultCandidateTable,
    ResultCandidateChart,
  },

  computed: {
    candidates(): any {
      const totalVotes = this.result.candidates.reduce(
        (partialSum, a) => partialSum + a.votesCount,
        0
      );

      return this.result.candidates.map((item) => ({
        candidateName: `${item.lastname}, ${item.lastname} ${
          item.middlename.toUpperCase().split("")[0]
        }.`,
        votePercentage: `${Math.round((item.votesCount / totalVotes) * 100)}%`,
        ...item,
      }));
    },
  },
});
</script>

<style>
</style>