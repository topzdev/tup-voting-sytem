<template>
  <nuxt-child />
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import pageRoles from "@/configs/page-roles";
import { UserRolesValue } from "@/types/roles";

export default Vue.extend({
  middleware: ["roles"],
  meta: {
    allowedRoles: pageRoles.admin.this,
  },
});
</script>

<style>
</style>