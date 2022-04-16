<template>
  <span>
    <change-role-card />
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import ChangeRoleCard from "~/components/pages/users/cards/ChangeRoleCard.vue";

export default Vue.extend({
  components: { ChangeRoleCard },
});
</script>

<style>
</style>