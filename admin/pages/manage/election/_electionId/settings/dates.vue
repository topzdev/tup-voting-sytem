<template>
  <dates-setting-card />
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import settingsMixin from "@/mixins/settings.mixin";
import DatesSettingCard from "@/components/pages/settings/cards/DatesSettingCard.vue";
export default mixins(settingsMixin).extend({
  components: {
    DatesSettingCard,
  },
});
</script>

<style>
</style>