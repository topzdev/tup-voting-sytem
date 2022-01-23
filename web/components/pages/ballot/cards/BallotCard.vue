<template>
  <v-card>
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

    <v-card-text v-if="data.candidates && data.candidates.length">
      <v-row no-gutters>
        <v-col cols="12">
          <v-item-group v-model="selected" multiple>
            <v-row>
              <v-col
                cols="4"
                v-for="(candidates, idx) in data.candidates"
                :key="idx"
              >
                <v-item v-slot="{ active, toggle }">
                  <candidate-card
                    :active="active"
                    :data="candidates"
                    :toggle="toggle"
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
import { BallotItem } from "@/types/app";
import CandidateCard from "@/components/pages/ballot/cards/CandidateCard.vue";

export default Vue.extend({
  props: {
    data: {
      type: Object,
    } as PropOptions<BallotItem>,
  },

  data() {
    return {
      selected: [1],
    };
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

      return `Choosen 1 / ${minimum}`;
    },
  },
});
</script>

<style>
</style>