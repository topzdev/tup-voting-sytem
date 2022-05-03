<template>
  <span>
    <my-account-card />
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import MyAccountCard from "~/components/pages/my-account/cards/MyAccountCard.vue";

export default Vue.extend({
  components: { MyAccountCard },
});
</script>

<style>
</style>