<template>
  <page-center>
    <v-row>
      <v-col class="mx-auto text-center" md="4">
        <h1 class="headline-6 font-weight-medium mb-3">Create Organization</h1>

        <organization-create-form :createFunc="create" />
      </v-col>
    </v-row>
  </page-center>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

import PageCenter from "@/components/utils/PageCenter.vue";
import OrganizationCreateForm from "@/components/pages/org/OrganizationCreateForm.vue";
import organizationServices, {
  CreateOrganizationDto,
} from "../../services/organization.service";

export default Vue.extend({
  components: {
    PageCenter,
    OrganizationCreateForm,
  },

  methods: {
    async create(data: CreateOrganizationDto) {
      try {
        const result = await organizationServices.create(data);
        console.log(result);
        this.$accessor.snackbar.set({
          show: true,
          message: "Organization Added!",
          timeout: 5000,
          color: "success",
        });
        this.$router.push("/org");
      } catch (error: any) {
        throw error.response.data.error;
      }
    },
  },

  data() {
    return {};
  },
});
</script>

<style>
</style>