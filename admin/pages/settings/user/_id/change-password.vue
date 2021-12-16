<template>
  <span>
    <user-change-password-dialog :isOpen="true" />
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import UserChangePasswordDialog from "@/components/pages/users/UserChangePasswordDialog.vue";

export default Vue.extend({
  components: { UserChangePasswordDialog },
});
</script>

<style>
</style>