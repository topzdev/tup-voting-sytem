<template>
  <general-settings-card></general-settings-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import settingsMixin from "@/mixins/settings.mixin";
import GeneralSettingsCard from "@/components/pages/settings/cards/GeneralSettingsCard.vue";
export default mixins(settingsMixin).extend({
  components: {
    GeneralSettingsCard,
  },
});
</script>

<style>
</style>