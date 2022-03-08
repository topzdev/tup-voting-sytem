<template>
  <span>
    <voters-create-dialog :is-open="true" />
  </span>
</template>

<script lang="ts">
import VotersCreateDialog from "~/components/pages/voters/dialogs/VotersCreateDialog.vue";
import pageStatus from "@/configs/page-status.config";
export default {
  meta: {
    status: pageStatus.voters.create,
  },
  name: "settings-user-create",
  components: {
    VotersCreateDialog,
  },
  head: {
    title: "Voters",
  },
};
</script>

<style>
</style>