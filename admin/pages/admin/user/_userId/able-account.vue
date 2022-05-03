<template>
  <span>
    <able-account-card />
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import AbleAccountCard from "~/components/pages/users/cards/AbleAccountCard.vue";

export default Vue.extend({
  components: { AbleAccountCard },
});
</script>

<style>
</style>