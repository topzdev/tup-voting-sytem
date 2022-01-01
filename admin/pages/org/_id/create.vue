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

<script>
import Vue, { PropOptions } from "vue";
import PageBars from "@/components/bars/PageBars.vue";
import AccountContainer from "@/components/containers/AccountContainer.vue";
import ElectionCreateForm from "@/components/pages/election/ElectionCreateForm.vue";
import electionServices from "../../../services/election.service";

export default Vue.extend({
  layout: "account",
  components: {
    PageBars,
    AccountContainer,
    ElectionCreateForm,
  },
  textFieldProps: {
    outlined: true,
    hideDetails: "auto",
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
        this.$router.push(`/org/${this.organizationId}`);
      } catch (error) {
        throw error;
      }
    },
  },

  computed: {
    organizationId() {
      return this.$route.params.id;
    },
  },

  data() {
    return {};
  },
});
</script>

<style>
</style>