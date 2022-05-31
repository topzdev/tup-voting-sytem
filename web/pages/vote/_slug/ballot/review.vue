<template>
  <v-row>
    <v-col cols="12">
      <div class="text-center my-lg-0 my-lg-4">
        <h2>Review your ballot</h2>
        <p class="text--secondary">
          We recommend to review your ballot before submitting it
        </p>
      </div>

      <v-row class="mt-5" no-gutters v-for="item in reviewItems" :key="item.id">
        <v-col cols="12" class="mb-3">
          <h3 class="text-center" v-text="item.title"></h3>
        </v-col>
        <v-col>
          <v-row class="d-flex justify-center">
            <v-col
              v-for="candidate in item.candidates"
              :key="candidate.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <candidate-card :data="candidate" :readonly="true" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <ballot-stepper>
        <v-btn color="primary" large text @click="back" :disabled="loading">
          Back
        </v-btn>

        <v-app-bar-title class="ml-3">Review Your Ballot</v-app-bar-title>

        <v-btn
          class="ml-auto"
          color="primary"
          large
          @click="submit"
          :loading="loading"
          :disabled="loading"
        >
          Submit Ballot
        </v-btn>
      </ballot-stepper>
    </v-col>
  </v-row>
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

  validate({ $accessor, route, redirect }) {
    if (!$accessor.ballot.votes.length) {
      redirect(`/election/${route.params.slug}/ballot`);
    }
    return true;
  },

  data() {
    return {
      loading: false,
    };
  },
  methods: {
    back() {
      this.gotoBallot();
    },

    async submit() {
      try {
        this.loading = true;
        await this.$accessor.ballot.submitBallot();
        this.gotoFinal();
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<style>
</style>