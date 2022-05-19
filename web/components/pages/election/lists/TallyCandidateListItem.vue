<template>
  <v-list-item>
    <v-list-item-action class="mr-0 pr-0">
      <p :class="numberClass">
        {{ idx + 1 }}
      </p>
    </v-list-item-action>

    <v-list-item-avatar class="mr-2">
      <app-image
        :size="45"
        :alt="candidate.candidateName + ' Photo'"
        :src="candidate.profile_photo"
      />
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>
        <p class="body-2 mb-1" :title="title">
          <v-icon v-if="candidate.winner" size="18" color="orange"
            >mdi-crown</v-icon
          >

          <span class="text--primary" v-text="candidate.candidateName"></span>

          <span class="text--secondary" v-text="party"></span>
        </p>
        <v-progress-linear
          :title="voteSummarry"
          rounded
          :color="progressColor"
          :value="progressPercentage"
          height="5"
        ></v-progress-linear>
      </v-list-item-title>
    </v-list-item-content>

    <v-list-item-action
      style="width: 60px"
      class="d-flex flex-column align-end"
    >
      <p class="body-2 mb-0" v-text="totalVotes"></p>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { FinalTallyCandidate, FinalTallyPositions } from "@/services/public";

export default Vue.extend({
  props: {
    idx: {
      type: Number,
    },
    position: {
      type: Object,
    } as PropOptions<FinalTallyPositions>,
    candidate: {
      type: Object,
    } as PropOptions<FinalTallyCandidate>,
  },

  computed: {
    numberClass(): string {
      let classList: string[] = ["body-2 mb-0"];

      if (this.candidate.winner) {
        classList.push("orange--text font-weight-bold");
      }

      return classList.join(" ");
    },

    progressPercentage(): number {
      return (this.candidate.votesCount / this.position.totalVotes) * 100;
    },
    progressColor(): string {
      return this.candidate.winner ? "orange" : "grey";
    },

    party(): string {
      const party = this.candidate.party;
      return `(${party && party ? party.title : "IND"})`;
    },

    title(): string {
      const winnerMessage = this.candidate.winner
        ? ` - ${this.position.title} Winner`
        : "";
      return `${this.candidate.candidateName} ${this.party}${winnerMessage}`;
    },

    voteSummarry(): string {
      return `${this.candidate.votesCount} out of ${this.position.totalVotes} voted this position`;
    },

    totalVotes(): string {
      return new Intl.NumberFormat().format(this.candidate.votesCount);
    },
  },
});
</script>

<style>
</style>