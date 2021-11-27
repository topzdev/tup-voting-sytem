<template>
  <h1>
    Roles Allows is: SUPER_ADMIN = sadmin, your role is {{ $auth.user.role }}
  </h1>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  middleware: ["roles"],
  auth: true,
  meta: {
    // "SUPER_ADMIN" | "ADMIN" | "WATCHER" | "DEV"
    roles: ["ADMIN"],
  },
});
</script>

<style>
</style>