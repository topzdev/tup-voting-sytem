<template>
  <archive-election-card />
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import settingsMixin from "@/mixins/settings.mixin";
import ArchiveElectionCard from "@/components/pages/settings/cards/ArchiveElectionCard.vue";
import pageStatus from "@/configs/page-status.config";
export default mixins(settingsMixin).extend({
  meta: {
    status: pageStatus.settings.archiveElection,
  },

  components: {
    ArchiveElectionCard,
  },
});
</script>

<style>
</style>