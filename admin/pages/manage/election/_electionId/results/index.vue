<template>
  <span>
    <page-bars title="Election Results">
      <v-btn class="ml-auto" large outlined color="primary">Refresh</v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="ml-2" color="primary" large v-bind="attrs" v-on="on">
            <v-icon>mdi-file-outline</v-icon>
            Download</v-btn
          >
        </template>
        <v-list>
          <v-list-item @click="downloadElectionResults">
            <v-list-item-icon>
              <v-icon>{{ icons.results }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Election Results</v-list-item-title>
          </v-list-item>
          <v-list-item @click="downloadVoteAudit">
            <v-list-item-icon>
              <v-icon>{{ icons.voters }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Vote Audit</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </page-bars>

    <v-container>
      <v-row>
        <v-col cols="12">
          <winner-section />
        </v-col>

        <v-col cols="12">
          <ballot-result-section :results="results" />
        </v-col>
      </v-row>
    </v-container>
  </span>
</template>

<script lang="ts">
import BallotResultSection from "@/components/pages/results/sections/BallotResultSection.vue";
import WinnerSection from "@/components/pages/results/sections/WinnerSection.vue";
import icons from "@/configs/icons";
import pageStatus from "@/configs/page-status.config";
import resultServices, { ElectionResults } from "@/services/results.service";
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import manageElectionMixins from "@/mixins/manage-election.mixins";

export default mixins(manageElectionMixins).extend({
  components: {
    WinnerSection,
    BallotResultSection,
    PageBars,
  },
  meta: {
    status: pageStatus.results,
  },

  data() {
    return {
      icons,
      winners: [{}],
      results: [] as ElectionResults,
    };
  },

  async fetch() {
    await this.fetchResults();
  },

  methods: {
    async downloadElectionResults() {},

    async downloadVoteAudit() {},

    async fetchResults() {
      if (!this.electionId) return;
      this.results = await resultServices.getResults(this.electionId);
    },
  },
});
</script>

<style>
</style>