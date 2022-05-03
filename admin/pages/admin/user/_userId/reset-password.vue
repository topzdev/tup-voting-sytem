<template>
  <span>
    <reset-password-card />
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import ResetPasswordCard from "~/components/pages/users/cards/ResetPasswordCard.vue";

export default Vue.extend({
  components: { ResetPasswordCard },
});
</script>

<style>
</style>