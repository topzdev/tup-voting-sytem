<template>
  <v-chip v-if="data" :title="data.title" outlined style="user-select: none">
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
import { Party } from "@/services/party.service";
export default Vue.extend({
  props: {
    data: Object as PropOptions<Party>,
  },

  components: {
    AppImage,
  },
});
</script>

<style>
</style>