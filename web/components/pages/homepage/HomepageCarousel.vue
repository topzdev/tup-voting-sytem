<template>
  <v-card rounded flat>
    <v-carousel height="450" hide-delimiters>
      <v-carousel-item
        v-for="(item, i) in items"
        :key="i"
        :src="item.src"
        reverse-transition="fade-transition"
        transition="fade-transition"
      ></v-carousel-item>
    </v-carousel>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  computed: {
    items() {
      return [
        {
          src: "/carousel/carousel-1.jpg",
        },

        {
          src: "/carousel/carousel-2.png",
        },
      ];
    },
  },
});
</script>

<style>
</style>