<template>
  <span>
    <user-create-dialog :is-open="true" />
  </span>
</template>

<script lang="ts">
import UserCreateDialog from "@/components/pages/users/UserCreateDialog.vue";
export default {
  name: "settings-user-create",
  components: {
    UserCreateDialog,
  },
};
</script>

<style>
</style>