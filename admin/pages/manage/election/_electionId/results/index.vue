<template>
  <span>
    <page-bars title="Election Results">
      <v-btn class="ml-auto" large outlined color="primary" @click="refresh"
        >Refresh</v-btn
      >
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
          <result-summary-section />
        </v-col>
        <v-col cols="12">
          <result-ballot-section :positions="positions" />
        </v-col>
      </v-row>
    </v-container>
  </span>
</template>

<script lang="ts">
import ResultBallotSection from "~/components/pages/results/sections/ResultBallotSection.vue";
import ResultSummarySection from "@/components/pages/results/sections/ResultSummarySection.vue";
import icons from "@/configs/icons";
import pageStatus from "@/configs/page-status.config";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import WinnerSection from "~/components/pages/results/sections/ResultWinnerSection.vue";

export default mixins(manageElectionMixins).extend({
  components: {
    WinnerSection,
    ResultBallotSection,
    PageBars,
    ResultSummarySection,
  },
  meta: {
    status: pageStatus.results,
  },

  data() {
    return {
      icons,
    };
  },

  async fetch() {
    await this.fetchResults();
  },

  computed: {
    positions() {
      return this.$accessor.electionResult.positions;
    },
  },

  methods: {
    refresh() {
      this.fetchResults();
    },

    async downloadElectionResults() {
      await this.$accessor.electionResult.downloadElectionResults();
    },

    async fetchResults() {
      await this.$accessor.electionResult.fetchResults();
    },

    async downloadVoteAudit() {
      await this.$accessor.electionResult.downloadVoteAudit();
    },
  },
});
</script>

<style>
</style>