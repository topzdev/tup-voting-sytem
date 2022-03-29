<template>
  <client-only>
    <div>
      <VueApexCharts
        width="500"
        :options="chartOptions"
        :series="series"
      ></VueApexCharts>
    </div>
  </client-only>
</template>

<script>
export default {
  props: ["chartOptions", "series"],
  components: {
    VueApexCharts: () => import("vue-apexcharts"),
  },
};
</script>