<template>
  <span>
    <page-bars back backTooltip="Back to Election" title="Create Election">
    </page-bars>

    <account-container>
      <v-col class="mx-auto text-center" md="6">
        <election-create-form :createFunc="create" />
      </v-col>
    </account-container>
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import PageBars from "@/components/bars/PageBars.vue";
import AccountContainer from "@/components/containers/AccountContainer.vue";
import ElectionCreateForm from "~/components/pages/election/forms/ElectionCreateForm.vue";
import electionServices from "@/services/election.service";
import orgMixin from "~/mixins/org.mixins";
import mixins from "vue-typed-mixins";
import pageConfig from "../../../../configs/pages.config";

export default mixins(orgMixin).extend({
  auth: true,
  layout: "account",
  components: {
    PageBars,
    AccountContainer,
    ElectionCreateForm,
  },

  computed: {
    organizationId(): number {
      return parseInt(this.$route.params.organizationId);
    },
  },
  methods: {
    async create(data) {
      try {
        const result = await electionServices.create({
          organization_id: this.organizationId,
          ...data,
        });
        console.log(result);
        this.$accessor.snackbar.set({
          show: true,
          message: "Election Added",
          timeout: 5000,
          color: "success",
        });
        this.$router.push(
          pageConfig.organization(this.organizationId).this().route
        );
      } catch (error) {
        throw error;
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