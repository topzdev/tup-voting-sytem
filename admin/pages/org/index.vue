<template>
  <page-center>
    <v-row>
      <v-col class="mx-auto text-center" md="4">
        <div v-if="$fetchState.pending">Loading...</div>
        <div v-else-if="$fetchState.error">Something went wrong</div>
        <organization-empty v-else-if="!items.length" />
        <organization-list v-else :items="items" :count="count" />
      </v-col>
    </v-row>
  </page-center>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import OrganizationEmpty from "../../components/pages/org/OrganizationEmpty.vue";
import OrganizationList from "../../components/pages/org/OrganizationList.vue";
import PageCenter from "../../components/utils/PageCenter.vue";
import organizationServices from "../../services/organization.service";

export default Vue.extend({
  components: {
    PageCenter,
    OrganizationEmpty,
    OrganizationList,
  },

  data() {
    return {
      loading: true,
      items: [],
      count: 0,
    };
  },
  fetchOnServer: false,
  async fetch() {
    try {
      const result = await organizationServices.getAll({});
      this.items = result.organization;
      this.count = result.count;
    } catch (error) {
      console.log(error);
    }
  },
});
</script>

<style>
</style>