<template>
  <v-card :class="errorClass">
    <v-card-title>
      <v-row class="no-gutters">
        <v-col>
          <h1
            class="title font-weight-bold text--primary"
            v-text="data.title"
          />
          <p class="body-2 text--secondary my-0" v-text="data.description" />
        </v-col>
      </v-row>
    </v-card-title>
    <v-divider />
    <v-card-subtitle
      class="info--text"
      v-if="ballotRuleText"
      v-html="ballotRuleText"
    />

    <v-card-subtitle class="error--text pt-1" v-if="error">
      <h3>Errors</h3>
      <ul>
        <li v-for="(item, idx) in error.messages" :key="idx">
          {{ item }}
        </li>
      </ul>
    </v-card-subtitle>

    <v-card-text v-if="data.candidates && data.candidates.length">
      <v-row no-gutters>
        <v-col cols="12">
          <v-item-group>
            <v-row>
              <v-col
                cols="4"
                v-for="(candidate, idx) in data.candidates"
                :key="idx"
              >
                <v-item>
                  <candidate-card
                    :active="isSelected(candidate.id)"
                    :data="candidate"
                    :toggle="vote"
                  />
                </v-item>
              </v-col>
            </v-row>
          </v-item-group>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-subtitle v-if="selectedCounter" v-html="selectedCounter" />
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { BallotError, BallotItem, Candidate } from "@/types/app";
import CandidateCard from "@/components/pages/ballot/cards/CandidateCard.vue";

export default Vue.extend({
  props: {
    data: {
      type: Object,
    } as PropOptions<BallotItem>,

    error: { type: Object } as PropOptions<BallotError | null>,
  },

  data() {
    return {};
  },

  components: {
    CandidateCard,
  },

  computed: {
    ballotRuleText(): string {
      return `You can select a <b>maximum of ${this.data.max_selected}</b> and a <b>minimum of ${this.data.min_selected}</b> candidate(s)`;
    },

    selectedCounter(): string {
      const minimum = this.data.min_selected;
      if (minimum <= 1) return "";

      return `Selected ${this.selected.length} / ${minimum}`;
    },

    isMultiple(): any {
      return this.data.min_selected > 1;
    },

    errorClass(): string {
      return this.error ? "ballot--error" : "";
    },

    ballotVotes() {
      return this.$accessor.ballot.votes;
    },

    selected(): Candidate[] {
      return this.ballotVotes.filter(
        (item) => item.position_id === this.data.id
      );
    },
  },

  methods: {
    isSelected(candidate_id: number) {
      return !!this.selected.find((item) => item.id === candidate_id);
    },

    vote(candidate: Candidate) {
      if (this.isMultiple) {
        if (this.selected.length >= this.data.min_selected) {
          if (this.selected.find((item) => item.id === candidate.id)) {
            this.$accessor.ballot.vote(candidate);
          }

          return;
        }
        this.$accessor.ballot.vote(candidate);
      } else {
        if (this.selected.find((item) => item.id === candidate.id)) {
          this.$accessor.ballot.vote(candidate);
        } else {
          // remove the current vote t
          if (this.selected.length) {
            this.$accessor.ballot.vote(this.selected[0]);
          }
          // replace the old vote new vote
          this.$accessor.ballot.vote(candidate);
        }
      }
    },
  },

  watch: {},
});
</script>

<style scoped lang="scss">
.ballot {
  &--error {
    outline: 3px solid #f44336 !important ;
    box-shadow: 0px 0px 20px 0px rgba(#f44336, 0.2) !important;
  }
}
</style>