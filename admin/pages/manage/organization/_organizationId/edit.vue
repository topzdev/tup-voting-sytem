<template>
  <span>
    <page-bars back title="Edit Organization"> </page-bars>

    <account-container>
      <v-col class="mx-auto text-center" md="6">
        <div v-if="$fetchState.pending">Loading...</div>
        <div v-else-if="$fetchState.error">Something went wrong</div>
        <organization-edit-form
          v-else
          :defaultData="defaultData"
          :updateFunc="update"
        />
      </v-col>
    </account-container>
  </span>
</template>

<script>
import Vue, { PropOptions } from "vue";

import PageBars from "@/components/bars/PageBars.vue";
import AccountContainer from "@/components/containers/AccountContainer.vue";
import OrganizationCreateForm from "~/components/pages/org/forms/OrganizationCreateForm.vue";
import OrganizationEditForm from "~/components/pages/org/forms/OrganizationEditForm.vue";
import organizationServices, {
  UpdateOrganizationDto,
} from "@/services/organization.service";
import orgMixin from "../../../../mixins/org.mixins";

export default Vue.extend({
  auth: true,
  mixins: [orgMixin],
  components: {
    PageBars,
    AccountContainer,
    OrganizationCreateForm,
    OrganizationEditForm,
  },
  data() {
    return {
      defaultData: null,
    };
  },

  fetchOnServer: false,
  async fetch() {
    try {
      this.defaultData = await organizationServices.getById(
        this.organizationId
      );
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    async update(data) {
      try {
        const result = await organizationServices.update(data);
        console.log(result);
        this.$accessor.snackbar.set({
          show: true,
          message: "Organization Updated!",
          timeout: 5000,
          color: "success",
        });
        this.$router.push("/");
      } catch (error) {
        throw error.response.data.error;
      }
    },
  },
});
</script>

<style>
</style>