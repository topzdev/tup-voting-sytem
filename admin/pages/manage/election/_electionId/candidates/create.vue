<template>
  <span>
    <page-bars :title="title" :backTo="backTo" :backTooltip="backTooltip">
    </page-bars>
    <manage-container>
      <template v-slot:centered>
        <candidate-create-spot-checker
          v-if="step === 1"
          :checkPosition="checkPosition"
        />
        <candidate-create-form v-if="step === 2" :createFunc="create" />
      </template>
    </manage-container>
  </span>
</template>


<script lang="ts">
import ManageContainer from "@/components/containers/ManageContainer.vue";
import mixins from "vue-typed-mixins";
import PageBars from "@/components/bars/PageBars.vue";
import CandidateCreateForm from "@/components/pages/candidate/forms/CandidateCreateForm.vue";
import CandidateCreateSpotChecker from "@/components/pages/candidate/forms/CandidateCreateSpotChecker.vue";
import candidateServices, {
  PositionAvailabilityDTO,
} from "@/services/candidate.service";
import candidateMixin from "@/mixins/candidate.mixin";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import pageStatus from "@/configs/page-status.config";
export default mixins(candidateMixin, manageElectionMixins).extend({
  meta: {
    status: pageStatus.candidate.create,
  },
  components: {
    PageBars,
    ManageContainer,
    CandidateCreateForm,
    CandidateCreateSpotChecker,
  },
  head: {
    title: "Create Candidate",
  },

  data() {
    return {
      step: 1,
      form: {
        party_id: null as null | number,
        position_id: null as null | number,
      },
    };
  },

  methods: {
    async create(data: any) {
      if (!this.electionId) return;

      try {
        const result = await candidateServices.create({
          ...data,
          ...this.form,
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
    async checkPosition(data: PositionAvailabilityDTO) {
      if (!data.position_id) return {};

      this.form.party_id = data.party_id;
      this.form.position_id = data.position_id;
      this.step++;
    },
  },

  computed: {
    title(): string {
      return this.step === 1
        ? "Select Party and Position "
        : "Candidate Information";
    },

    backTo(): any {
      switch (this.step) {
        case 1:
          return () => {
            this.$router.back();
          };
        case 2:
          return () => {
            this.step = 1;
          };
      }
    },

    backTooltip(): string {
      return this.step === 2 ? "Back to Select Party and Position " : "Back";
    },
  },
});
</script>

<style>
</style>