<template>
  <v-card :class="['overview-count', color]" dark>
    <div
      v-if="progress"
      :style="progressWidth"
      :class="['overview-count__progress', color, 'darken-1']"
    >
      <v-skeleton-loader
        v-if="progressWidth === '100%'"
        width="100%"
        height="100%"
        type="card"
      ></v-skeleton-loader>
    </div>

    <v-card-text class="overview-count__body">
      <v-icon class="overview-count__icon">{{ icon }}</v-icon>

      <h3 class="overview-count__count white--text" dark v-html="count"></h3>
    </v-card-text>

    <v-card-subtitle
      class="overview-count__title white--text"
      dark
      v-html="title"
    >
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  props: {
    color: {
      type: String,
      default: "green",
    },

    icon: {
      type: String,
      default: "mdi-vote-outline",
    },

    count: {
      type: [String, Number],
      default: 1,
    },

    title: {
      type: [String, Number],
      default: "Participations",
    },

    progress: {
      type: String,
    },
  },

  computed: {
    progressWidth(): string {
      return `width: ${this.progress}`;
    },
    hasTitleProps(): any {
      return this.$props["title"];
    },
  },
});
</script>

<style lang="scss" scoped>
.overview-count {
  position: relative;
  &__body {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    text-align: right;
    padding: 15px 15px;
  }

  &__progress {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0;
    z-index: 1;
  }

  &__icon {
    position: absolute;
    top: 50%;
    left: 15px;
    font-size: 65px;
    transform: translateY(-50%);
    opacity: 0.7;
    z-index: 2;
  }

  &__count {
    position: relative;
    z-index: 2;
    margin: 0;
    text-align: right;
    font-size: 45px;
    line-height: 100%;
  }

  &__title {
    position: relative;
    z-index: 2;
    line-height: 100%;
    font-size: 15px;
    padding: 8px 15px;
    text-align: right;
    font-weight: 400;
    opacity: 0.8;
  }
}
</style>