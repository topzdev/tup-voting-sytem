<template>
  <v-container>
    <h2 class="text-center my-5">Review your ballot</h2>

    <v-row class="mt-5" no-gutters v-for="item in reviewItems" :key="item.id">
      <v-col cols="12" class="mb-3">
        <h3 class="text-center" v-text="item.title"></h3>
      </v-col>
      <v-col>
        <v-row class="d-flex justify-center">
          <v-col
            v-for="candidate in item.candidates"
            :key="candidate.id"
            cols="2"
          >
            <candidate-card :data="candidate" :readonly="true" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <ballot-stepper>
      <v-btn color="primary" large text @click="back"> Back </v-btn>

      <v-app-bar-title class="ml-3">Review Your Ballot</v-app-bar-title>

      <v-btn class="ml-auto" color="primary" large @click="submit">
        Submit Ballot
      </v-btn>
    </ballot-stepper>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import ballotMixins from "@/mixins/ballot.mixins";
import CandidateCard from "@/components/pages/ballot/cards/CandidateCard.vue";
import BallotStepper from "@/components/pages/ballot/BallotStepper.vue";
export default mixins(ballotMixins).extend({
  components: {
    CandidateCard,
    BallotStepper,
  },

  methods: {
    back() {
      this.$router.push(`${this.pagePath}ballot`);
    },

    submit() {
      alert("Submitting...");
    },
  },
});
</script>

<style>
</style>