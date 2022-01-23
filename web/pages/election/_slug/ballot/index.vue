<template>
  <v-row>
    <v-col cols="12">
      <election-header :election="election" />
    </v-col>

    <v-col
      v-for="(item, idx) in ballotItems"
      :key="idx"
      cols="8"
      class="mx-auto"
    >
      <ballot-card :data="item" />
    </v-col>

    <candidate-dialog />
  </v-row>
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

  async fetch() {
    await this.$accessor.ballot.fetchBallot();
  },
});
</script>

<style>
</style>