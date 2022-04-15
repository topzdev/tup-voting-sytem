<template>
  <span>
    <user-reset-password-dialog :isOpen="true" />
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import UserResetPasswordDialog from "~/components/pages/users/dialogs/UserResetPasswordDialog.vue";

export default Vue.extend({
  components: { UserResetPasswordDialog },
});
</script>

<style>
</style>