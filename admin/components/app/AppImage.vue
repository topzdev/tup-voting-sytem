<template>
  <v-img :src="parseSource" :alt="alt" />
</template>

<script>
export default {
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
  },

  computed: {
    parseSource() {
      if (typeof this.src === "string") return this.src;
      else if (typeof this.src === "object") return this.src.url;
      return null;
    },
  },
};
</script>

<style>
</style>