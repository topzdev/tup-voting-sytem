<template>
  <apex-chart :chartOptions="chartOptions" :series="series" :width="500" />
</template>

<script lang="ts">
import { ResultPosition } from "@/services/results.service";
import Vue, { PropOptions } from "vue";
import ApexChart from "~/components/charts/ApexChart.vue";

export default Vue.extend({
  props: {
    results: {
      type: Array,
    } as PropOptions<ResultPosition["candidates"]>,
  },
  components: {
    ApexChart,
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