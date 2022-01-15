<template>
  <close-election-card />
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import settingsMixin from "@/mixins/settings.mixin";
import CloseElectionCard from "@/components/pages/settings/cards/CloseElectionCard.vue";
export default mixins(settingsMixin).extend({
  components: {
    CloseElectionCard,
  },
});
</script>

<style>
</style>