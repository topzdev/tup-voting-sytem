<template>
  <v-avatar :color="background" size="140" class="logo-uploader">
    <template v-if="!parsedUrl"> Logo Here </template>
    <template v-else>
      <app-image :src="parsedUrl"></app-image>
    </template>

    <input
      type="file"
      class="logo-uploader__input"
      accept="image/*"
      @change="onFileChange"
    />
  </v-avatar>
</template>

<script>
import Vue from "vue";
import AppImage from "@/components/app/AppImage.vue";

export default Vue.extend({
  components: { AppImage },
  props: ["value"],
  props: {
    url: String,

    rules: Array,
  },

  data() {
    return {
      parsedUrl: null,
    };
  },

  watch: {
    url: {
      immediate: true,
      handler: function (value, oldVal) {
        this.parsedUrl = value;
      },
    },
  },

  computed: {
    background() {
      return !this.parsedUrl ? "grey white--text" : "";
    },
  },

  methods: {
    onFileChange(events) {
      const files = events.target.files;

      if (files && files.length) {
        const file = files[0];
        this.parsedUrl = URL.createObjectURL(file);
        this.$emit("input", file);
      }
    },
  },
});
</script>

<style lang="scss">
.logo-uploader {
  &__input {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: block;
    opacity: 0;
    cursor: pointer;
  }
}
</style>