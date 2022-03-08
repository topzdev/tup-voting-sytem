<template>
  <span>
    <election-header :election="election" />

    <nuxt-child />

    <v-app-bar app bottom fixed elevation="10">
      <template v-if="step === 1">
        <v-app-bar-title>Ballot</v-app-bar-title>

        <v-btn class="ml-auto" color="primary" large @click="toggleStep(2)">
          Next - Review Ballot
        </v-btn>
      </template>

      <template v-else-if="step === 2">
        <v-btn color="primary" large @click="toggleStep(1)" text> Back </v-btn>

        <v-btn class="ml-auto" color="primary" large @click="toggleStep(3)">
          Submit Ballot
        </v-btn>
      </template>

      <template v-else-if="step === 3"> </template>
    </v-app-bar>
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import ballotMixins from "@/mixins/ballot.mixins";
import ElectionHeader from "@/components/pages/election/ElectionHeader.vue";
import BallotCard from "@/components/pages/ballot/cards/BallotCard.vue";
import CandidateDialog from "@/components/pages/ballot/dialogs/CandidateDialog.vue";

export default mixins(ballotMixins).extend({
  components: {
    ElectionHeader,
    BallotCard,
    CandidateDialog,
  },

  data() {
    return {
      step: 1,
    };
  },

  methods: {
    toggleStep(step: number): void {
      if (step === 1) {
        this.step = 1;
        this.$router.push(`${this.pagePath}ballot`);
      } else if (step === 2) {
        this.step = 2;
        this.$router.push(`${this.pagePath}ballot/review`);
      } else if (step === 3) {
        this.step = 3;
        this.$router.push(`${this.pagePath}ballot/submit`);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
</style>