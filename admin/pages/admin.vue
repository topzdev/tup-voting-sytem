<template>
  <nuxt-child />
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  middleware: ["roles"],
  meta: {
    allowedRoles: ["SUPER_ADMIN"],
  },
});
</script>

<style>
</style>