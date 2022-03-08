<template>
  <span>
    <voters-import-dialog :is-open="true" />
  </span>
</template>

<script lang="ts">
import VotersImportDialog from "~/components/pages/voters/dialogs/VotersImportDialog.vue";
import pageStatus from "@/configs/page-status.config";

export default {
  meta: {
    status: pageStatus.voters.import,
  },
  components: {
    VotersImportDialog,
  },
  head: {
    title: "Import Voters",
  },
};
</script>

<style>
</style>