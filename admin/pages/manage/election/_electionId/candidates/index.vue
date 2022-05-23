<template>
  <span>
    <page-bars title="Candidates">
      <create-candidate-button btn-class="mr-2 ml-auto" />
    </page-bars>
    <manage-container>
      <candidate-table />
    </manage-container>
  </span>
</template>


<script lang="ts">
import ManageContainer from "@/components/containers/ManageContainer.vue";
import CandidateTable from "@/components/pages/candidate/CandidateTable.vue";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import CreateCandidateButton from "@/components/pages/candidate/buttons/CreateCandidateButton.vue";
export default mixins(manageElectionMixins).extend({
  components: {
    PageBars,
    CreateCandidateButton,
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