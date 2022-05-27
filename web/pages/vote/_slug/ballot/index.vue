<template>
  <v-container>
    <v-row>
      <v-col md="8" class="mx-auto">
        <v-row>
          <!-- <v-col cols="12">
            <pre
              style="
                position: fixed;
                left: 0;
                top: 10%;
                background: white;
                padding: 20px;
                font-size: 14px;
              "
            >
          <h1>Errors</h1>

        </pre
            >
          </v-col> -->

          <v-col v-if="summaryError.length" cols="12" class="mx-auto">
            <v-alert type="error" outlined>
              <ul>
                <li v-for="item in summaryError" :key="item.id">
                  <span v-html="item.title"></span>

                  <v-btn
                    text
                    small
                    color="error"
                    @click="scrollToElement(item.id)"
                    >Fix me!</v-btn
                  >
                </li>
              </ul>
            </v-alert>
          </v-col>

          <v-col
            v-for="(item, idx) in ballotItems"
            :key="idx"
            cols="12"
            class="mx-auto"
          >
            <ballot-card
              :id="postionIdGenerator(item.id)"
              :data="item"
              :error="showError ? hasError(item.id) : null"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <ballot-stepper>
      <v-app-bar-title>Ballot</v-app-bar-title>

      <v-btn class="ml-auto" color="primary" large @click="submit">
        Next - Review Ballot
      </v-btn>
    </ballot-stepper>
    <candidate-dialog />
  </v-container>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import ballotMixins from "@/mixins/ballot.mixins";
import ElectionHeader from "~/components/pages/voting/ElectionHeader.vue";
import BallotCard from "@/components/pages/ballot/cards/BallotCard.vue";
import CandidateDialog from "@/components/pages/ballot/dialogs/CandidateDialog.vue";
import BallotStepper from "@/components/pages/ballot/BallotStepper.vue";
import { scrollToTop, scrollToElement } from "@/utils/scrolls";
type SummaryErrors = {
  title: string;
  id: string;
}[];

export default mixins(ballotMixins).extend({
  components: {
    ElectionHeader,
    BallotCard,
    CandidateDialog,
    BallotStepper,
  },

  data() {
    return {
      summaryError: [] as SummaryErrors,
      showError: false,
    };
  },

  methods: {
    scrollToElement,

    hasError(position_id: number) {
      return this.ballotErrors.length
        ? this.ballotErrors.filter(
            (item) => item.position_id === position_id
          )[0]
        : null;
    },

    generateErrorSummary() {
      this.summaryError = [];

      if (this.ballotErrors.length) {
        this.ballotErrors.forEach((item) => {
          const errorLength = item.messages.length;
          this.summaryError.push({
            title: `<b>${item.title}</b> field ${
              errorLength > 1 ? "have" : "has"
            } ${errorLength} error(s)`,
            id: this.postionIdGenerator(item.position_id),
          });
        });

        if (this.ballotErrors.length > 1) {
          scrollToTop();
        } else {
          scrollToElement(this.summaryError[0].id);
        }
      }
    },

    submit() {
      this.$accessor.ballot.ballotErrorChecker();

      if (this.ballotErrors.length) {
        this.showError = true;
        this.generateErrorSummary();
      } else {
        this.$router.push(`${this.pagePath}ballot/review`);
      }
    },

    postionIdGenerator(position_id: number) {
      return `pos-${position_id}`;
    },
  },
});
</script>

<style lang="scss">
body,
html {
  scroll-behavior: smooth;
}
</style>