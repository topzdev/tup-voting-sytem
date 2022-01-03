<template>
  <span>
    <voters-create-dialog :is-open="true" />
  </span>
</template>

<script lang="ts">
import VotersCreateDialog from "@/components/pages/voters/VotersCreateDialog.vue";
export default {
  name: "settings-user-create",
  components: {
    VotersCreateDialog,
  },
};
</script>

<style>
</style>