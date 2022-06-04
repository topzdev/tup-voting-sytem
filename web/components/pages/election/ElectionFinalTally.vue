<template>
  <v-row>
    <v-col v-for="position in tally" :key="position.id" cols="12" lg="6" xl="4">
      <v-card style="height: 100%" outlined>
        <v-card-title class="pb-0">
          {{ position.title }}
        </v-card-title>

        <v-list>
          <tally-candidate-list-item
            v-for="(candidate, idx) in position.candidates"
            :key="candidate.id"
            :idx="idx"
            :candidate="candidate"
            :position="position"
          />
        </v-list>

        <v-card-subtitle
          class="pt-0 caption"
          v-if="position.is_tie_resolved && position.tie_resolved_message"
        >
          Tie Breaker Procedure/Message:
          <b> "{{ position.tie_resolved_message || "No Message" }}" </b>
        </v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { FinalTallyPositions } from "@/services/public";
import TallyCandidateListItem from "./lists/TallyCandidateListItem.vue";

export default Vue.extend({
  components: { TallyCandidateListItem },
  props: {
    tally: {
      type: Array,
    } as PropOptions<FinalTallyPositions[]>,
  },

  methods: {
    percentage(candidateVote: number, overallVote: number) {
      return (candidateVote / overallVote) * 100;
    },
  },
});
</script>

<style>
</style>