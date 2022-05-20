<template>
  <v-card :color="cardColor" style="height: 100%" dark>
    <v-card-title class="py-2">
      <v-icon class="mr-1">mdi-post</v-icon> Result
    </v-card-title>
    <v-card-text class="d-flex align-center pt-1 pb-3">
      <div>
        <h2 class="mb-0 white--text" v-html="issueCounter"></h2>
        <p class="mb-0 subtitle" v-html="issueMessage"></p>
      </div>

      <div class="d-flex flex-column align-end ml-auto mt-n10">
        <template v-if="!isResultPublished">
          <v-btn :disabled="!allowPublish" text @click="publish">Publish</v-btn>
        </template>

        <template v-else>
          <v-btn class="mb-3" text @click="unpublish">Unpublish</v-btn>
          <v-btn
            color="blue"
            depressed
            :href="election.urls.electionUrl"
            target="_blank"
            >View</v-btn
          >
        </template>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { ResultIssue } from "@/services/results.service";
import { Election, ElectionWithUrl } from "@/services/election.service";
import settingsServices from "../../../../services/settings.service";

export default Vue.extend({
  props: {
    election: {
      type: Object,
    } as PropOptions<ElectionWithUrl>,
    issues: {
      type: Object,
    } as PropOptions<ResultIssue>,
  },

  computed: {
    isElectionPublic(): boolean {
      return this.election.is_public;
    },

    hasIssuseLeft(): boolean {
      return this.issues.totalIssues > this.issues.totalResolved;
    },

    issueMessage(): string {
      let message = "";

      if (this.isElectionPublic) {
        if (this.hasIssuseLeft) {
          message = "Fix Issue first to publish result";
        } else {
          if (this.election.is_tally_public) {
            message = "The result is already published";
          } else {
            message = "You may now publish the result";
          }
        }
      } else {
        message = "The election must be public";
      }

      return message;
    },

    issueCounter(): string {
      if (this.hasIssuseLeft) {
        return `${
          this.issues.totalIssues - this.issues.totalResolved
        } issues(s) left`;
      }

      return this.isResultPublished
        ? "View result now!"
        : "Publish result now!";
    },
    allowPublish(): boolean {
      if (this.hasIssuseLeft || !this.isElectionPublic) {
        return false;
      }

      return true;
    },

    isResultPublished(): boolean {
      return this.election.is_tally_public;
    },

    cardColor(): string {
      return this.isResultPublished ? "blue lighten-1" : "success lighten-1";
    },
  },

  methods: {
    publish() {
      this.$accessor.system.showAppDialog({
        show: true,
        title: "Publish Result",
        message: "Are you sure to public the election result?",
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            hideDialog();

            this.$accessor.system.showAuthenticationDialog({
              button: {
                yesFunction: async () => {
                  try {
                    await this.$accessor.electionResult.publishResult();

                    this.$accessor.snackbar.set({
                      show: true,
                      message: `Election result is now published`,
                      timeout: 5000,
                      color: "success",
                    });
                  } catch (error) {
                    console.error(error);

                    this.$accessor.snackbar.set({
                      show: true,
                      message: `Can't publish result now, Try again later.`,
                      timeout: 5000,
                      color: "error",
                    });
                  }
                },
              },
              type: "default",
              message:
                "The election officer must authenticate first before approving this action.",
              allowedRole: "super-admin",
              show: true,
            });
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },

    unpublish() {
      this.$accessor.system.showAppDialog({
        show: true,
        title: "Unpublish Result",
        message: "Are you sure to unpublish the election result?",
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            hideDialog();

            this.$accessor.system.showAuthenticationDialog({
              button: {
                yesFunction: async () => {
                  try {
                    await this.$accessor.electionResult.unPublishResult();

                    this.$accessor.snackbar.set({
                      show: true,
                      message: `Election result is unpublished`,
                      timeout: 5000,
                      color: "success",
                    });
                  } catch (error) {
                    this.$accessor.snackbar.set({
                      show: true,
                      message: `Can't unpublish result now, Try again later.`,
                      timeout: 5000,
                      color: "error",
                    });
                  }
                },
              },
              type: "default",
              message:
                "The election officer must authenticate first before approving this action.",
              allowedRole: "super-admin",
              show: true,
            });
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },
  },
});
</script>

<style>
</style>