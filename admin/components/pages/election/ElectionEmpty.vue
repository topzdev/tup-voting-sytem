<template>
  <span>
    <h1 class="display-2">No Election Yet</h1>
    <p class="mt-3 mx-auto body-1" style="width: 75%">
      Please create a new election.
    </p>
    <v-btn
      color="primary"
      large
      width="75%"
      class="mt-1 mx-auto"
      :to="createElectionRoute"
      >Create Election</v-btn
    >
  </span>
</template>
<script lang="ts">
import Vue from "vue";
import pageConfig from "~/configs/pages.config";
import orgMixins from "@/mixins/org.mixins";
import mixins from "vue-typed-mixins";
export default mixins(orgMixins).extend({
  computed: {
    thisPageConfig() {
      return pageConfig.organization(this.organizationId).this();
    },
    createElectionRoute() {
      return pageConfig.organization(this.organizationId).createElection()
        .route;
    },
  },
});
</script>

<style>
</style>