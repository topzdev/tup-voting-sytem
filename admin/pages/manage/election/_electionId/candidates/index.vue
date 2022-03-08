<template>
  <span>
    <page-bars title="Candidates">
      <v-btn
        v-if="hideByStatus(pageStatus.candidate.create)"
        color="primary"
        class="mr-2 ml-auto"
        :to="createCandidateRoute()"
        large
        >New Candidate</v-btn
      >
    </page-bars>
    <manage-container>
      <candidate-table />
    </manage-container>
  </span>
</template>


<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import ManageContainer from "@/components/containers/ManageContainer.vue";
import candidateMixins from "@/mixins/candidate.mixin";
import CandidateTable from "@/components/pages/candidate/CandidateTable.vue";
import restrictionsMixins from "@/mixins/restrictions.mixin";
import manageElectionMixins from "@/mixins/manage-election.mixins";

export default mixins(
  candidateMixins,
  restrictionsMixins,
  manageElectionMixins
).extend({
  components: {
    PageBars,
    CandidateTable,
    ManageContainer,
  },

  computed: {
    pageTitle(): string {
      return this.links.candidates.title;
    },

    toolbarTitle(): string {
      return this.links.candidates.toolbarTitle || this.pageTitle;
    },
  },
  head(): any {
    return {
      title: this.pageTitle,
    };
  },
});
</script>

<style>
</style>