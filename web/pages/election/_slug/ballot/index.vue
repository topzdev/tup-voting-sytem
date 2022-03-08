<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(item, idx) in ballotItems"
        :key="idx"
        cols="8"
        class="mx-auto"
      >
        <ballot-card :data="item" />
      </v-col>
    </v-row>
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

export default mixins(ballotMixins).extend({
  components: {
    ElectionHeader,
    BallotCard,
    CandidateDialog,
  },

  async fetch() {
    await this.$accessor.ballot.fetchBallot();
  },

  data() {
    return {
      error: [],
    };
  },

  computed: {
    ballotVotes() {
      return this.$accessor.ballot.votes;
    },
  },

  methods: {
    submit() {},
  },
});
</script>

<style lang="scss" scoped>
</style>