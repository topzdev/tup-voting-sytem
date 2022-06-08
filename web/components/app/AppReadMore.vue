<template>
  <p>
    {{ trimmedDescription }}
    <v-btn
      v-if="showButton"
      text
      link
      small
      class="px-0 py-0 text-capitalize"
      color="primary"
      @click="toggle = !toggle"
      >{{ toggleText }}</v-btn
    >
  </p>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  props: {
    max_length: {
      type: Number,
      default: 100,
    },
    text: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      toggle: false,
    };
  },

  computed: {
    toggleText(): string {
      return "Read " + (this.toggle ? "Less" : "More");
    },

    showButton(): boolean {
      return this.text.length >= this.max_length;
    },
    trimmedDescription(): string {
      const description = this.text;
      return !this.toggle && this.showButton
        ? description.split("").splice(0, this.max_length).join("") + "..."
        : description;
    },
  },
});
</script>

<style>
</style>