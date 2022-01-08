<template>
  <v-progress-circular
    :size="size"
    indeterminate
    color="primary"
  ></v-progress-circular>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    size: {
      default: "40",
      type: String,
    },
  },
});
</script>
<style>
</style>