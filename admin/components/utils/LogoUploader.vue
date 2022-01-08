<template>
  <span class="logo-uploader text-center">
    <v-avatar :color="background" :size="size">
      <div class="d-flex flex-column" v-if="!parsedUrl">
        <h4>
          {{ label }}
        </h4>
        <p class="caption">{{ description }}</p>
      </div>
      <template v-else>
        <app-image :src="parsedUrl" contain></app-image>
      </template>

      <input
        ref="uploader"
        type="file"
        class="logo-uploader__input"
        accept="image/*"
        @change="onFileChange"
      />
    </v-avatar>

    <v-btn
      v-if="withBtn"
      class="logo-uploader__btn"
      fab
      small
      color="primary"
      @click="openUploader"
    >
      <v-icon>mdi-camera</v-icon>
    </v-btn>
  </span>
</template>

<script  lang="ts">
import Vue from "vue";
import AppImage from "@/components/app/AppImage.vue";

export default Vue.extend({
  components: { AppImage },
  props: {
    url: [String],
    size: {
      type: String,
      default: "140",
    },
    rules: Array,
    label: {
      type: String,
      default: "Logo",
    },

    description: {
      type: String,
      default: "Click to logo",
    },

    color: {
      type: String,
      default: "grey lighten-1",
    },

    withBtn: {
      type: Boolean,
    },
  },

  data() {
    return {
      parsedUrl: null as string | null,
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
    background(): string {
      return !this.parsedUrl ? this.color : "grey lighten-4";
    },
  },

  methods: {
    openUploader() {
      (this.$refs as any).uploader.click();
    },
    onFileChange(events): void {
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

<style lang="scss" scoped>
.logo-uploader {
  position: relative;

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
  &__btn {
    position: absolute;
    bottom: 15px;
    right: 15px;
  }
}
</style>