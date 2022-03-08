<template>
  <span>
    <voters-edit-dialog :isOpen="true" />
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import VotersEditDialog from "~/components/pages/voters/dialogs/VotersEditDialog.vue";
import pageStatus from "@/configs/page-status.config";

export default Vue.extend({
  meta: {
    status: pageStatus.voters.edit,
  },
  components: { VotersEditDialog },
});
</script>

<style>
</style>