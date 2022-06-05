<template>
  <v-card style="position: relative" color="purple lighten-1" dark>
    <v-card-title class="py-2">
      <v-icon class="mr-1">mdi-vote</v-icon> Votes In
    </v-card-title>
    <v-card-text class="pt-1 pb-3">
      <div>
        <h2 class="mb-0 white--text">{{ other_info.votedCount }}</h2>
        <p class="mb-0 subtitle">
          out of {{ other_info.votersCount }} registered voters
        </p>
      </div>

      <div
        class="d-flex flex-column align-end ml-auto"
        style="
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
        "
      >
        <apex-chart
          :chartOptions="chartOptions"
          :series="series"
          :width="120"
          :height="150"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { ResultIssue, ResultOtherInfo } from "@/services/results.service";
import ApexChart from "~/components/charts/ApexChart.vue";

export default Vue.extend({
  props: {
    other_info: {
      type: Object,
    } as PropOptions<ResultOtherInfo>,
  },
  components: {
    ApexChart,
  },

  computed: {
    chartOptions(): any {
      return {
        chart: this.chart,
        labels: this.labels,
        colors: ["#20E647"],
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                offsetY: -10,
                color: "#fff",
                fontSize: "10px",
              },
              value: {
                offsetY: 0,
                color: "#fff",
                fontSize: "18px",
                show: true,
              },
            },
          },
        },
        fill: {
          type: "solid",
        },
        stroke: {
          lineCap: "round",
        },
      };
    },
    chart(): any {
      return {
        type: "radialBar",
        id: "vuechart-example",
      };
    },

    labels(): any {
      return ["Voted %"];
    },

    percentage(): string {
      return (
        ((this.other_info.votedCount / this.other_info.votersCount) * 100) |
        0
      ).toFixed(0);
    },

    series(): any {
      return [this.percentage];
    },
  },
});
</script>

<style>
</style>