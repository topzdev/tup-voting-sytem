<template>
  <v-card v-resize="onResize" rounded outlined>
    <v-carousel :height="carouselHeight" hide-delimiters>
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
  data() {
    return {
      carouselHeight: 500,
    };
  },

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

  mounted() {
    this.onResize();
  },

  methods: {
    onResize() {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 600) {
        this.carouselHeight = 200;
      } else if (windowWidth > 600 && windowWidth <= 960) {
        this.carouselHeight = 350;
      } else {
        this.carouselHeight = 500;
      }
    },
  },
});
</script>
