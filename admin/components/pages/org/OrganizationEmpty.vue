<template>
  <span>
    <v-icon size="100">{{ thisPageConfig.icon }}</v-icon>
    <h1 class="display-2">No Organization Yet</h1>
    <p class="mt-3 mx-auto body-1" style="width: 75%">
      Create an organization which manage the election
    </p>
    <v-btn color="primary" large width="75%" class="mt-1 mx-auto"
      >Create Organization</v-btn
    >
  </span>
</template>
vue <script lang="ts">
import Vue from "vue";
import mixins from "vue-typed-mixins";
import pageConfig from "~/configs/pages.config";
import orgMixin from "@/mixins/org.mixins";
export default mixins(orgMixin).extend({
  computed: {
    thisPageConfig() {
      return pageConfig.organization(this.organizationId).this();
    },
  },
});
</script>

<style>
</style>