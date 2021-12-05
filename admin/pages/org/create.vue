<template>
  <page-center>
    <v-row>
      <v-col class="mx-auto text-center" md="4">
        <h1 class="headline-6 font-weight-medium mb-3">Create Organization</h1>

        <organization-create-form />
      </v-col>
    </v-row>
  </page-center>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

import PageCenter from "@/components/utils/PageCenter.vue";
import OrganizationCreateForm from "@/components/pages/org/OrganizationCreateForm.vue";

export default Vue.extend({
  components: {
    PageCenter,
    OrganizationCreateForm,
  },

  data() {
    return {};
  },
});
</script>

<style>
</style>