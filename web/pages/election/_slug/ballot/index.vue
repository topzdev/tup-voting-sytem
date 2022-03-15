<template>
  <v-container>
    <v-row>
      <v-col cols="8">
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

          {{ ballotErrors }}
          ------
          <h1>Votes</h1>
          <!-- {{ ballotVotes }} -->
        </pre>
      </v-col>
      <v-col
        v-for="(item, idx) in ballotItems"
        :key="idx"
        cols="8"
        class="mx-auto"
      >
        <ballot-card
          :data="item"
          :error="showError ? hasError(item.id) : null"
        />
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
import ElectionHeader from "@/components/pages/election/ElectionHeader.vue";
import BallotCard from "@/components/pages/ballot/cards/BallotCard.vue";
import CandidateDialog from "@/components/pages/ballot/dialogs/CandidateDialog.vue";
import BallotStepper from "@/components/pages/ballot/BallotStepper.vue";
export default mixins(ballotMixins).extend({
  components: {
    ElectionHeader,
    BallotCard,
    CandidateDialog,
    BallotStepper,
  },

  async fetch() {
    await this.$accessor.ballot.fetchBallot();
  },

  data() {
    return {
      error: [],
      showError: false,
    };
  },

  methods: {
    hasError(position_id: number) {
      return this.ballotErrors.length
        ? this.ballotErrors.filter(
            (item) => item.position_id === position_id
          )[0]
        : null;
    },

    submit() {
      this.$accessor.ballot.ballotErrorChecker();

      if (this.ballotErrors.length) {
        this.showError = true;
      } else {
        this.$router.push(`${this.pagePath}ballot/review`);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
</style>