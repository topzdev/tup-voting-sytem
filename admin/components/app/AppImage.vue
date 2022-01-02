<template>
  <img :src="parseSource" :alt="alt" />
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
      if (this.src instanceof String) return this.src;
      else if (this.src instanceof Object) return this.src.url;
      return null;
    },
  },
};
</script>

<style>
</style>