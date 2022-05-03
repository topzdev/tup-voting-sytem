<template>
  <span>
    <change-password-card />
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import ChangePasswordCard from "~/components/pages/my-account/cards/ChangePasswordCard.vue";

export default Vue.extend({
  components: { ChangePasswordCard },
});
</script>

<style>
</style>