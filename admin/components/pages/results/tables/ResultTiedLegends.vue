<template>
  <v-row>
    <v-col
      class="d-flex py-0"
      cols="auto"
      v-for="(item, idx) in legendsItems"
      :key="idx"
    >
      <div
        :class="item.color"
        style="display: flex; height: 20px; width: 20px"
      ></div>

      <p class="text-primary secondary--text ml-1 mb-0">{{ item.title }}</p>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  data() {
    return {
      legends: {
        in: {
          title: "Winner",
          color: "orange lighten-4",
        },
        tied: {
          title: "Tied",
          color: "light-blue lighten-4",
        },
        lose: {
          title: "Lose",
          color: "blue-grey lighten-4",
        },
      },
    };
  },
  computed: {
    legendsItems(): any[] {
      return Object.values(this.legends);
    },
  },
});
</script>

<style>
</style>