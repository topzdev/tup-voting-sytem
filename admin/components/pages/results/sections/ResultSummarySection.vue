<template>
  <v-row>
    <v-col v-if="other_info" cols="3">
      <summary-vote-in-card :other_info="other_info" />
    </v-col>
    <v-col v-if="issues" cols="3">
      <summary-issue-card :issues="issues" />
    </v-col>
    <v-col v-if="issues" cols="3">
      <summary-publish-card :issues="issues" :election="electionInfo" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import SummaryVoteInCard from "@/components/pages/results/cards/SummaryVoteInCard.vue";
import SummaryIssueCard from "@/components/pages/results/cards/SummaryIssueCard.vue";
import SummaryPublishCard from "@/components/pages/results/cards/SummaryPublishCard.vue";

import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "@/mixins/manage-election.mixins";

export default mixins(manageElectionMixins).extend({
  components: { SummaryVoteInCard, SummaryIssueCard, SummaryPublishCard },

  computed: {
    issues() {
      return this.$accessor.electionResult.issues;
    },
    other_info() {
      return this.$accessor.electionResult.other_info;
    },
  },
});
</script>

<style>
</style>