import Vue from "vue";
import { Line } from "vue-chartjs/legacy";

Vue.component("line-chart", {
  extends: Line,
  props: ["data", "options"],
  mounted() {
    // @ts-ignore
    this.renderChart(this.data, this.options);
  },
});
