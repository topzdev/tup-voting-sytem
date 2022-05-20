<template>
  <v-row>
    <v-col
      v-for="(item, idx) in legends"
      class="d-flex pt-0 align-center"
      cols="auto"
      :key="idx"
    >
      <template v-if="!item.separator">
        <div
          :class="item.color"
          :style="item.circle ? circleStyle : boxStyle"
        ></div>

        <p class="text-primary ml-1 mb-0">{{ item.title }}</p>
      </template>
      <template v-else>
        <v-divider vertical />
      </template>
    </v-col>
  </v-row>
</template>
    

<script lang="ts">
import Vue, { PropOptions } from "vue";

type LegendItem = {
  separator?: boolean;
  title?: string;
  color?: string;
  circle?: boolean;
};

export default Vue.extend({
  props: {
    withTie: {
      type: Boolean,
    },
  },
  data() {
    return {};
  },
  computed: {
    legends(): LegendItem[] {
      let initial: LegendItem[] = [
        {
          title: "Winner(s)",
          color: "orange lighten-4",
        },
        {
          title: "Loser(s)",
          color: "blue-grey lighten-4",
        },
      ];

      if (this.withTie) {
        initial = [
          {
            circle: true,
            title: "Tied",
            color: "light-blue",
          },

          { separator: true },

          ...initial,
        ];
      }
      return initial;
    },

    circleStyle() {
      return ` 
      display: block;
      height: 8px;
      width: 8px;
      min-width: 8px;
      border-radius: 100%;
    `;
    },
    boxStyle() {
      return `display: flex; height: 15px; width: 15px`;
    },
  },
});
</script>

<style>
</style>