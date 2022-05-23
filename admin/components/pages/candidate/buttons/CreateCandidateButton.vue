<template>
  <v-btn
    :disabled="noPosition"
    :width="width"
    v-if="hideByStatus(pageStatus.candidate.create)"
    color="primary"
    :to="createCandidateRoute"
    large
    :class="btnClass"
    >New Candidate</v-btn
  >
</template>
   
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import restrictionsMixin from "@/mixins/restrictions.mixin";
import pageConfig from "@/configs/pages.config";
import manageElectionMixins from "@/mixins/manage-election.mixins";

export default mixins(manageElectionMixins, restrictionsMixin).extend({
  props: {
    width: {
      type: [String, Number],
    },
    btnClass: {
      type: [String],
    },
  },

  computed: {
    createCandidateRoute(): string {
      return pageConfig.candidate().create().route;
    },

    noPosition(): boolean {
      if (!this.electionInfo) return true;
      return !this.electionInfo?.positionsCount;
    },
  },
});
</script>

<style>
</style>