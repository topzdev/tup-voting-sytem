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

    <v-container fluid>
      <v-row v-if="!$fetchState.pending && !$fetchState.error">
        <v-col cols="12">
          <result-summary-section />
        </v-col>
        <v-col cols="12">
          <result-ballot-section :positions="positions" />
        </v-col>
      </v-row>

      <template v-else-if="$fetchState.pending">
        <v-col>
          <page-center>
            <app-loading></app-loading>
          </page-center>
        </v-col>
      </template>

      <div v-else-if="$fetchState.error">Something went wrong</div>
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
import PageCenter from "@/components/utils/PageCenter.vue";
import WinnerSection from "~/components/pages/results/sections/ResultWinnerSection.vue";
import { ResultPositionsWithWinner } from "@/services/results.service";
import authMixin from "@/mixins/auth.mixins";
import pageRoles from "@/configs/page-roles";

export default mixins(manageElectionMixins, authMixin).extend({
  components: {
    WinnerSection,
    ResultBallotSection,
    PageBars,
    PageCenter,
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
    positions(): ResultPositionsWithWinner[] {
      return this.$accessor.electionResult.positions;
    },
  },

  methods: {
    async fetchResults() {
      await this.$accessor.electionResult.fetchResults();
    },
    refresh() {
      this.fetchResults();
    },

    async downloadElectionResults() {
      this.$accessor.system.showAppDialog({
        show: true,
        title: "Download Results",
        message:
          "Please do not alter the result once the results downloaded. <a target='_blank' rel='nofollow noindex' href='https://comelec.gov.ph/index.html?r=References/RelatedLaws/ElectionLaws/SynchronizedNationalandLocal/RA7166#sec30'>RA7166 Section 30</a>",
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            hideDialog();
            this.systemAuthentication(
              {
                button: {
                  yesFunction: async () => {
                    await this.$accessor.electionResult.downloadElectionResults();
                  },
                },
              },
              "current-only-password",
              pageRoles.dialogs.downloadResults
            );
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },

    async downloadVoteAudit() {
      await this.$accessor.electionResult.downloadVoteAudit();
    },
  },
});
</script>

<style>
</style>