<template>
  <span>
    <voters-import-dialog :is-open="true" />
  </span>
</template>

<script lang="ts">
import VotersImportDialog from "~/components/pages/voters/dialogs/VotersImportDialog.vue";

export default {
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