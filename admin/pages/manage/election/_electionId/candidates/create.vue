<template>
  <span>
    <page-bars title="Create Candidate" back> </page-bars>
    <manage-container>
      <template v-slot:centered>
        <candidate-create-form :createFunc="create" />
      </template>
    </manage-container>
  </span>
</template>


<script lang="ts">
import ManageContainer from "@/components/containers/ManageContainer.vue";
import mixins from "vue-typed-mixins";
import PageBars from "@/components/bars/PageBars.vue";
import CandidateCreateForm from "@/components/pages/candidate/forms/CandidateCreateForm.vue";
import candidateServices from "@/services/candidate.service";
import candidateMixin from "@/mixins/candidate.mixin";
import manageElectionMixins from "@/mixins/manage-election.mixins";
export default mixins(candidateMixin, manageElectionMixins).extend({
  components: {
    PageBars,
    ManageContainer,
    CandidateCreateForm,
  },
  head: {
    title: "Create Candidate",
  },
  methods: {
    async create(data: any) {
      if (!this.electionId) return;

      try {
        const result = await candidateServices.create({
          ...data,
          election_id: this.electionId,
        });
        this.$accessor.snackbar.set({
          show: true,
          message: "Candidates Added",
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