<template>
  <span>
    <voters-edit-dialog :isOpen="true" />
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import VotersEditDialog from "@/components/pages/voters/VotersEditDialog.vue";

export default Vue.extend({
  components: { VotersEditDialog },
});
</script>

<style>
</style>