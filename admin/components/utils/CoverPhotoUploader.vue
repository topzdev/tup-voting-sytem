<template>
  <v-card
    :height="height"
    :color="background"
    class="cover-uploader text-center"
    flat
    outlined
    max-width="100%"
    rounded="3"
  >
    <div class="d-flex flex-column" v-if="!parsedUrl">
      <h3>
        {{ label }}
      </h3>
      <p class="caption">{{ description }}</p>
    </div>
    <template v-else>
      <app-image
        :src="parsedUrl"
        :max-height="height"
        max-width="100%"
        width="300px"
      ></app-image>
    </template>

    <input
      ref="uploader"
      type="file"
      class="cover-uploader__input"
      accept="image/*"
      @change="onFileChange"
    />

    <v-btn
      v-if="withBtn"
      class="cover-uploader__btn"
      fab
      color="primary"
      @click="openUploader"
    >
      <v-icon>mdi-camera</v-icon>
    </v-btn>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import AppImage from "@/components/app/AppImage.vue";

export default Vue.extend({
  components: { AppImage },
  props: {
    value: {
      required: true,
    },
    url: String,
    height: {
      type: String,
      default: "200px",
    },

    label: {
      type: String,
      default: "Cover Photo",
    },

    description: {
      type: String,
      default: "Click to upload cover photo",
    },

    color: {
      type: String,
      default: "grey lighten-2",
    },

    withBtn: {
      type: Boolean,
    },

    rules: Array,
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
      return !this.parsedUrl ? this.color : "";
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
.cover-uploader {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
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
    bottom: 10px;
    right: 10px;
  }
}
</style>