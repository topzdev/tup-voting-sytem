<template>
  <span>
    <user-edit-dialog :isOpen="true" />
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import UserEditDialog from "~/components/pages/users/dialogs/UserEditDialog.vue";

export default Vue.extend({
  components: { UserEditDialog },
});
</script>

<style>
</style>