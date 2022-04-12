<template>
  <v-row>
    <v-col v-if="election" cols="12">
      <election-header :election="election" />
    </v-col>

    <v-col v-if="$fetchState.pending">
      <page-center style="min-height: 70vh">
        <app-loading />
      </page-center>
    </v-col>

    <template v-else>
      <v-col v-if="electionError" cols="12">
        <page-center style="min-height: 70vh">
          <election-error :electionError="electionError"></election-error>
        </page-center>
      </v-col>

      <v-col v-if="!electionError && election" cols="12">
        <nuxt-child />
      </v-col>
    </template>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import ballotMixins from "@/mixins/ballot.mixins";
import ElectionHeader from "~/components/pages/voting/ElectionHeader.vue";
import BallotCard from "@/components/pages/ballot/cards/BallotCard.vue";
import CandidateDialog from "@/components/pages/ballot/dialogs/CandidateDialog.vue";
import PageCenter from "@/components/utils/PageCenter.vue";
import ElectionError from "~/components/pages/voting/ElectionError.vue";
import AppLoading from "@/components/app/AppLoading.vue";

export default mixins(ballotMixins).extend({
  auth: true,
  components: {
    ElectionHeader,
    BallotCard,
    CandidateDialog,
    ElectionError,
    PageCenter,
    AppLoading,
  },

  async fetch() {
    await this.$accessor.ballot.fetchBallot();
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
      } else if (step === 2) {
        this.step = 2;
      } else if (step === 3) {
        this.step = 3;
        this.$router.push(`${this.pagePath}ballot/submit`);
      }
    },
  },

  destroyed() {
    this.$accessor.ballot.resetBallot();
  },
});
</script>

<style lang="scss" scoped>
</style>