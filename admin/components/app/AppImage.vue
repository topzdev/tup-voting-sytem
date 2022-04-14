<template>
  <v-img
    :src="parseSource"
    :alt="alt"
    :contain="contain"
    :width="width"
    :height="height"
    :max-width="maxWidth"
    :max-height="maxHeight"
  >
    <template v-slot:placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular
          indeterminate
          color="grey lighten-5"
        ></v-progress-circular>
      </v-row>
    </template>
  </v-img>
</template>

<script lang="ts">
import Vue from "vue";
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

    provider: {
      type: String,
    },

    public_id: {
      type: String,
    },

    contain: Boolean,
    height: [Number, String],
    width: [Number, String],
    maxHeight: [Number, String],
    maxWidth: [Number, String],
  },

  computed: {
    parseSource(): any {
      if (typeof this.src === "string") return this.src;
      else if (typeof this.src === "object") return this.src.url;
      return null;
    },
  },
});
</script>

<style>
</style>