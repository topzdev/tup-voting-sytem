<template>
  <v-snackbar
    v-model="show"
    :timeout="snackbar.timeout"
    :color="snackbar.color"
  >
    {{ snackbar.message }}

    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="reset"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  data() {
    return {
      show: false,
    };
  },

  computed: {
    snackbar() {
      return this.$accessor.snackbar.default;
    },
  },

  watch: {
    ["$accessor.snackbar.default"](val) {
      this.show = val.show;
    },
  },

  methods: {
    reset() {
      this.$accessor.snackbar.reset();
    },
  },
});
</script>

<style>
</style>