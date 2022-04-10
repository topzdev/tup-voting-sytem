<template>
  <publicity-card />
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import PublicityCard from "@/components/pages/settings/cards/PublicityCard.vue";
import pageStatus from "@/configs/page-status.config";

export default Vue.extend({
  meta: {
    status: pageStatus.settings.publicity.page,
  },
  components: {
    PublicityCard,
  },
});
</script>

<style>
</style>