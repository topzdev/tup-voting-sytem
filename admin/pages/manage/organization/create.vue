<template>
  <span>
    <page-bars back title="Create Organization"> </page-bars>

    <account-container>
      <v-col class="mx-auto text-center" md="6">
        <organization-create-form :createFunc="create" />
      </v-col>
    </account-container>
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import PageBars from "@/components/bars/PageBars.vue";
import AccountContainer from "@/components/containers/AccountContainer.vue";
import OrganizationCreateForm from "@/components/pages/org/OrganizationCreateForm.vue";
import organizationServices, {
  CreateOrganizationDto,
} from "@/services/organization.service";

export default Vue.extend({
  auth: true,
  layout: "account",
  components: {
    PageBars,
    AccountContainer,
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
        this.$router.push("/");
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