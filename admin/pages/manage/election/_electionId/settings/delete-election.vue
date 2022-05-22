<template>
  <delete-election-card />
</template>

<script lang="ts">
import DeleteElectionCard from "@/components/pages/settings/cards/DeleteElectionCard.vue";
import settingsMixin from "@/mixins/settings.mixin";
import mixins from "vue-typed-mixins";
export default mixins(settingsMixin).extend({
  components: {
    DeleteElectionCard,
  },
});
</script>

<style>
</style>