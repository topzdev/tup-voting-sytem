<template>
  <page-center>
    <v-row>
      <v-col class="mx-auto text-center" md="4">
        <h1 class="headline-6 font-weight-medium mb-3">Edit Organization</h1>

        <organization-edit-form />
      </v-col>
    </v-row>
  </page-center>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

import PageCenter from "@/components/utils/PageCenter.vue";
import OrganizationCreateForm from "@/components/pages/org/OrganizationCreateForm.vue";
import OrganizationEditForm from "@/components/pages/org/OrganizationEditForm.vue";

export default Vue.extend({
  components: {
    PageCenter,
    OrganizationCreateForm,
    OrganizationEditForm,
  },

  data() {
    return {};
  },
});
</script>

<style>
</style>