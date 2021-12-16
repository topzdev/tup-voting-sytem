<template>
  <span>
    <user-edit-dialog :isOpen="true" />
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import UserEditDialog from "@/components/pages/users/UserEditDialog.vue";

export default Vue.extend({
  name: "settings-user-edit-id",
  components: { UserEditDialog },
});
</script>

<style>
</style>