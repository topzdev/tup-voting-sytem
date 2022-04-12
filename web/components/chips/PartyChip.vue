<template>
  <v-chip
    :to="partyRoute"
    :small="small"
    :large="large"
    v-if="data"
    :title="data.title"
    :outlined="outlined"
    style="user-select: none"
  >
    <v-avatar v-if="data.logo" left size="20">
      <app-image :alt="data.title" :src="data.logo" :size="20"></app-image>
    </v-avatar>
    {{ data.ticker }}
  </v-chip>
  <v-chip outlined v-else> Independent </v-chip>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import AppImage from "@/components/app/AppImage.vue";
import { Party } from "../../types/app";
import pageRoutes from "../../configs/page-routes";
export default Vue.extend({
  props: {
    data: Object as PropOptions<Party>,
    large: Boolean,
    small: Boolean,
    outlined: Boolean,
  },

  components: {
    AppImage,
  },

  computed: {
    partyRoute(): string {
      if (!this.data.election) return "";
      return pageRoutes.party(this.data.election?.slug, this.data.id);
    },
  },
});
</script>

<style>
</style>