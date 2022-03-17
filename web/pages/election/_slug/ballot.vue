<template>
  <span>
    <election-header :election="election" />
    <nuxt-child />
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
  auth: true,
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
      } else if (step === 2) {
        this.step = 2;
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