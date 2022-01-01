<template>
  <v-chip
    :large="large"
    :small="small"
    :color="style.color"
    :outlined="outlined"
  >
    {{ style.text }}
  </v-chip>
</template>

<script>
const statuses = {
  completed: { text: "Completed", color: "primary" },
  running: { text: "Running", color: "success" },
  building: { text: "Building", color: "default" },
  archived: { text: "Archived", color: "warning" },
};

export default {
  props: {
    status: String,
    large: Boolean,
    small: Boolean,
    outlined: Boolean,
  },

  computed: {
    style() {
      return statuses[this.status];
    },
  },
};
</script>

<style>
</style>