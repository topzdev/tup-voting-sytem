<template>
  <pie-chart :chartOptions="chartOptions" :series="series" />
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { ElectionResult } from "@/services/results.service";
import PieChart from "@/components/charts/PieChart.vue";

export default Vue.extend({
  props: {
    results: {
      type: Array,
    } as PropOptions<ElectionResult["candidates"]>,
  },
  components: {
    PieChart,
  },

  computed: {
    chartOptions(): any {
      return {
        chart: this.chart,
        labels: this.labels,
      };
    },
    chart(): any {
      return {
        type: "donut",
        id: "vuechart-example",
      };
    },

    labels(): any {
      return this.results.map((item) => item.candidateName);
    },

    series(): any {
      return this.results.map((item) => item.votesCount);
    },
  },
});
</script>

<style>
</style>