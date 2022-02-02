<template>
  <span>
    <page-bars title="Create Party" back> </page-bars>
    <manage-container>
      <template v-slot:centered>
        <party-create-form :createFunc="create" />
      </template>
    </manage-container>
  </span>
</template>


<script lang="ts">
import ManageContainer from "@/components/containers/ManageContainer.vue";
import mixins from "vue-typed-mixins";
import PageBars from "@/components/bars/PageBars.vue";
import PartyCreateForm from "@/components/pages/party/forms/PartyCreateForm.vue";
import partyServices from "@/services/party.service";
import partyMixin from "@/mixins/party.mixin";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import pageStatus from "@/configs/page-status.config";

export default mixins(partyMixin, manageElectionMixins).extend({
  meta: {
    status: pageStatus.party.create,
  },

  components: {
    PageBars,
    ManageContainer,
    PartyCreateForm,
  },
  head: {
    title: "Create Party",
  },
  methods: {
    async create(data: any) {
      if (!this.electionId) return;

      try {
        const result = await partyServices.create({
          election_id: this.electionId,
          ...data,
        });
        this.$accessor.snackbar.set({
          show: true,
          message: "Party Added",
          timeout: 5000,
          color: "success",
        });
        this.$router.back();
      } catch (error: any) {
        throw error.response.data.error;
      }
    },
  },
});
</script>

<style>
</style>