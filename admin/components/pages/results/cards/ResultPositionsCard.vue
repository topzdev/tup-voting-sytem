<template>
  <v-card :id="cardId">
    <v-card-title>
      <p class="mb-0 mr-auto">{{ position.title }}</p>

      <v-menu v-if="menu.length" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, idx) in menu"
            :key="idx"
            @click="item.action"
          >
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-subtitle v-html="summary"> </v-card-subtitle>

    <v-card-text>
      <v-row>
        <v-col v-if="winners && winners.length" cols="12" class="pt-0">
          <result-winner-section :winners="winners" />

          <v-divider></v-divider>
        </v-col>

        <v-col cols="6">
          <template v-if="position.isTieOccured && !position.is_tie_resolved">
            <result-tied-candidate-table
              :position="position"
              :candidates="candidates"
            />
          </template>
          <template v-else>
            <result-candidate-table
              :position="position"
              :candidates="candidates"
            />
          </template>
        </v-col>

        <v-col cols="6">
          <result-candidate-chart :results="candidates" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import ResultCandidateChart from "@/components/pages/results/charts/ResultCandidateCharts.vue";
import ResultWinnerSection from "@/components/pages/results/sections/ResultWinnerSection.vue";
import ResultCandidateTable from "@/components/pages/results/tables/ResultCandidateTable.vue";
import ResultTiedCandidateTable from "@/components/pages/results/tables/ResultTiedCandidateTable.vue";
import pageRoles from "@/configs/page-roles";
import authMixin from "@/mixins/auth.mixins";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import {
  CandidateTieResult,
  ResultCandidate,
  ResultPositionsWithWinner,
} from "@/services/results.service";
import { PropOptions } from "vue";
import mixins from "vue-typed-mixins";

type Menu = {
  title: string;
  action: () => void;
};

export default mixins(manageElectionMixins, authMixin).extend({
  props: {
    position: {
      type: Object,
    } as PropOptions<ResultPositionsWithWinner>,
  },
  components: {
    ResultCandidateTable,
    ResultCandidateChart,
    ResultWinnerSection,
    ResultTiedCandidateTable,
  },

  computed: {
    cardId(): string {
      return `position-${this.position.id}`;
    },
    candidates(): ResultPositionsWithWinner["candidates"] {
      return this.position.candidates;
    },

    parsedCandidates(): ResultPositionsWithWinner["candidates"] {
      // this.position.candidates.forEach(function (item) {
      //   let tieItem = item as CandidateTieResult;
      //   if (tieItem.tie) {
      //     candidates = [
      //       ...candidates,
      //       ...tieItem.candidates.map((item) => ({ ...item, tie: true })),
      //     ];
      //   } else {
      //     candidates = [...candidates, item as ResultCandidate];
      //   }
      // });

      return this.candidates;
    },
    winners(): ResultPositionsWithWinner["winners"] {
      return this.position.winners;
    },

    menu(): Menu[] {
      let list: Menu[] = [];

      // if (this.position.isTieOccured && this.position.is_tie_resolved) {
      //   list.push({
      //     title: "Reset Tie",
      //     action: async () => {
      //       await this.resetTieBreaker();
      //     },
      //   });
      // }

      return list;
    },

    summary(): string {
      const candidateCount = this.parsedCandidates.length;
      const maxWinners = this.position.max_selected;
      const paragraphs = [
        `There are ${candidateCount} candidate(s) running in this position and only ${maxWinners} of them can
      be elected.`,
      ];

      return paragraphs.join(",");
    },
  },

  methods: {
    async resetTieBreaker() {
      if (!this.electionInfo?.is_tally_public) {
        this.$accessor.system.showAppDialog({
          show: true,
          title: "Reset Tie Breaker",
          message: "Are you sure to reset the tie breaker?",
          button: {
            anyEventHide: false,
            yesFunction: async ({ hideDialog }) => {
              hideDialog();

              this.systemAuthentication(
                {
                  button: {
                    yesFunction: async () => {
                      try {
                        await this.$accessor.electionResult.resetTieBreaker(
                          this.position.id
                        );

                        this.$accessor.snackbar.set({
                          show: true,
                          message: `Position ${this.position.title} tie breaker reset`,
                          timeout: 5000,
                          color: "success",
                        });
                      } catch (error) {
                        console.error(error);

                        this.$accessor.snackbar.set({
                          show: true,
                          message: `Can't reset position right now, Try again later.`,
                          timeout: 5000,
                          color: "error",
                        });
                      }
                    },
                  },
                },
                "current-only-password",
                pageRoles.dialogs.resetTieBreaker
              );
            },
            noFunction: ({ hideDialog }) => {
              hideDialog();
            },
          },
        });
      } else {
        this.$accessor.system.showAppDialog({
          show: true,
          title: "Set the election result to private",
          message:
            "To reset the tie breaker you must unpublish the result first.",
          button: {
            anyEventHide: false,
            yesLabel: "Okay",
            yesFunction: async ({ hideDialog }) => {
              hideDialog();
            },
            noFunction: ({ hideDialog }) => {
              hideDialog();
            },
          },
        });
      }
    },
  },
});
</script>

<style>
</style>