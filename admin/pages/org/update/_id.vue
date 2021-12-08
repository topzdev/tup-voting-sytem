<template>
  <page-center>
    <v-row>
      <v-col class="mx-auto text-center" md="4">
        <h1 class="headline-6 font-weight-medium mb-3">Edit Organization</h1>
        <div v-if="$fetchState.pending">Loading...</div>
        <div v-else-if="$fetchState.error">Something went wrong</div>
        <organization-edit-form
          v-else
          :defaultData="edit"
          :updateFunc="update"
        />
      </v-col>
    </v-row>
  </page-center>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

import PageCenter from "@/components/utils/PageCenter.vue";
import OrganizationCreateForm from "@/components/pages/org/OrganizationCreateForm.vue";
import OrganizationEditForm from "@/components/pages/org/OrganizationEditForm.vue";
import organizationServices, {
  UpdateOrganizationDto,
} from "../../../services/organization.service";

export default Vue.extend({
  components: {
    PageCenter,
    OrganizationCreateForm,
    OrganizationEditForm,
  },
  data() {
    return {
      edit: null,
    };
  },

  fetchOnServer: false,
  async fetch() {
    try {
      const id = this.$nuxt.$route.params.id;
      this.edit = await organizationServices.getById(id);
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    async update(data: UpdateOrganizationDto) {
      try {
        const result = await organizationServices.update(data);
        console.log(result);
        this.$accessor.snackbar.set({
          show: true,
          message: "Organization Updated!",
          timeout: 5000,
          color: "success",
        });
        this.$router.push("/org");
      } catch (error: any) {
        throw error.response.data.error;
      }
    },
  },
});
</script>

<style>
</style>