<template>
  <span>
    <remove-account-card />
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import RemoveAccountCard from "~/components/pages/users/cards/RemoveAccountCard.vue";

export default Vue.extend({
  components: { RemoveAccountCard },
});
</script>

<style>
</style>