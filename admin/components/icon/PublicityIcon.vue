<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-icon v-bind="attrs" v-on="on" :size="size">{{ isPublicIcon }}</v-icon>
    </template>
    <span>{{ label }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  props: {
    value: Boolean,
    size: Number,
    preLabel: String,
  },

  computed: {
    isPublicIcon(): string {
      return this.value ? "mdi-earth" : "mdi-lock";
    },

    label(): string {
      return `${this.preLabel ? this.preLabel : "Election"} is ${
        this.value ? "public" : "private"
      }`;
    },
  },
});
</script>

<style>
</style>