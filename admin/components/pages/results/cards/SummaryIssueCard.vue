<template>
  <v-card color="warning lighten-1" dark>
    <v-card-title class="py-2">
      <v-icon class="mr-1">mdi-alert-circle-outline</v-icon> Issues
    </v-card-title>
    <v-card-text class="d-flex align-center pt-1 pb-3">
      <div>
        <h2 class="mb-0 white--text" v-html="title"></h2>
        <p class="mb-0 subtitle" v-html="message"></p>
      </div>
      <div
        class="d-flex flex-column align-end ml-auto mt-n10"
        v-if="!hasIssueLeft"
      >
        <v-dialog v-model="dialog" width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on">View</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Issues</span>
            </v-card-title>
            <v-card-text>
              <v-list>
                <template v-for="(item, idx) in issues.messages">
                  <v-list-item class="px-0" :key="item.id">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.message }}
                        <v-chip v-if="item.resolved" color="success"
                          >Resolved</v-chip
                        >
                      </v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action v-if="!item.resolved">
                      <v-btn text color="orange" @click="actions(item)"
                        >Fix This Issue</v-btn
                      >
                    </v-list-item-action>
                  </v-list-item>

                  <v-divider :key="idx" />
                </template>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="dialog = false"> Close </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { ResultIssue, ResultIssueMessage } from "@/services/results.service";
import Vue, { PropOptions } from "vue";
import { scrollToElement } from "@/helpers/scrolls";

export default Vue.extend({
  props: {
    issues: {
      type: Object,
    } as PropOptions<ResultIssue>,
  },

  data() {
    return {
      dialog: false,
    };
  },

  computed: {
    hasIssueLeft(): boolean {
      return this.issues.totalIssues > this.issues.totalResolved;
    },
    title(): string {
      if (this.hasIssueLeft) {
        return this.issues.totalResolved + "";
      }

      return "No Issue left";
    },

    message(): string {
      if (this.hasIssueLeft) {
        return `out of ${this.issues.totalIssues} Issue(s) Resolved`;
      }
      return `${this.issues.totalIssues} Issue(s) have been resoloved`;
    },
  },
  methods: {
    closeDialog() {
      this.dialog = false;
    },
    gotoPositionCard() {},

    actions(issue: ResultIssueMessage) {
      if (issue.type === "position") {
        let positionId = "position-" + issue.id;
        scrollToElement(positionId);
        this.closeDialog();
      }
    },
  },
});
</script>

<style>
</style>