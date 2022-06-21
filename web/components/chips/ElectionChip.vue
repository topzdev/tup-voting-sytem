<template>
  <v-chip
    :to="electionRoute"
    :small="small"
    :large="large"
    v-if="election"
    :title="election.title"
    :outlined="outlined"
    style="user-select: none"
  >
    <v-avatar v-if="election.logo" left size="20">
      <app-image
        :alt="election.title"
        :src="election.logo"
        :size="20"
      ></app-image>
    </v-avatar>
    {{ election.title }}
  </v-chip>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import AppImage from "@/components/app/AppImage.vue";
import { Election, Party } from "../../types/app";
import pageRoutes from "../../configs/page-routes";
export default Vue.extend({
  props: {
    election: Object as PropOptions<Election>,
    large: Boolean,
    small: Boolean,
    outlined: Boolean,
  },

  components: {
    AppImage,
  },

  computed: {
    electionRoute(): string {
      return pageRoutes.election(this.election.slug).this().route;
    },
  },
});
</script>

<style>
</style>