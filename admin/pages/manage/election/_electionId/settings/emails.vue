<template>
  <emails-card />
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import settingsMixin from "@/mixins/settings.mixin";
import EmailsCard from "@/components/pages/settings/cards/EmailsCard.vue";
export default mixins(settingsMixin).extend({
  components: {
    EmailsCard,
  },
});
</script>

<style>
</style>