<template>
  <v-avatar :size="size" :style="avatarStyle">
    <app-image :size="size" :src="src" :alt="alt" />
  </v-avatar>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  props: {
    alt: {
      type: String,
    },

    size: {
      type: [Number, String],
    },

    src: {
      type: [String, Object],
      required: true,
    },

    borderWidth: {
      type: Number,
      default: 3,
    },
  },

  computed: {
    avatarStyle(): string {
      return `background: white; border: ${this.borderWidth}px solid #c4c4c4`;
    },
  },
});
</script>

<style>
</style>