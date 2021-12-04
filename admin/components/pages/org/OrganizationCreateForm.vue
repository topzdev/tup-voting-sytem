<template></template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

const defaultForm = {
  slug: "",
  title: "",
  description: "",
  ticker: "",
  themePrimary: "",
  themeSecondary: "",
};

export default Vue.extend({
  data() {
    return {
      loading: false,
      valid: true,
      alert: {
        show: false,
        type: "",
        message: "",
      },
      form: Object.assign({}, defaultForm),
    };
  },

  computed: {
    rules() {
      return {
        slug: [(v: any) => !!v || "Slug is required"],
        title: [(v: any) => !!v || "Title is required"],
        ticker: [(v: any) => !!v || "Ticker is required"],
        themePrimary: [(v: any) => !!v || "Theme Primary is required"],
        themeSecondary: [(v: any) => !!v || "Theme Secondary is required"],
      };
    },
  },
});
</script>

<style>
</style>