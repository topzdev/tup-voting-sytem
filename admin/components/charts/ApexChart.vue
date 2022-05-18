<template>
  <client-only>
    <div>
      <VueApexCharts
        :width="width"
        :height="height"
        :options="chartOptions"
        :series="series"
      ></VueApexCharts>
    </div>
  </client-only>
</template>

<script>
export default {
  props: ["chartOptions", "series", "height", "width"],
  components: {
    VueApexCharts: () => import("vue-apexcharts"),
  },
};
</script>