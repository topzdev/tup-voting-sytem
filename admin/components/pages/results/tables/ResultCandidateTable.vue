<template>
  <v-row>
    <v-col cols="12">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th
                v-for="(item, idx) in headers"
                :key="idx"
                class="text-left"
                v-text="item.text"
              ></th>
            </tr>
          </thead>
          <tbody>
            <result-candidate-row
              v-for="(item, idx) in candidates"
              :item="item"
              :key="idx"
              :idx="idx"
              :tie="item.tie"
              :in="idx < maxWinner"
              :with-tie-column="position.isTieOccured"
            />
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
    <v-col v-if="position.is_tie_resolved" cols="12" class="pt-0">
      <p class="caption mb-0">
        Tie Breaker procedure/Message:
        {{ position.tie_resolved_message || "No Message Provided" }}
      </p>
    </v-col>
    <v-col cols="12">
      <result-candidate-legends :with-tie="position.isTieOccured" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import {
  ElectionResult,
  ResultCandidate,
  ResultPositionsWithWinner,
} from "@/services/results.service";
import ResultCandidateRow from "./row/ResultCandidateRow.vue";
import ResultCandidateLegends from "./ResultCandidateLegends.vue";

export default Vue.extend({
  props: {
    position: {
      type: Object,
    } as PropOptions<ResultPositionsWithWinner>,
    candidates: {
      type: Array,
    } as PropOptions<(ResultCandidate & { tie: boolean })[]>,
  },
  components: {
    ResultCandidateRow,
    ResultCandidateLegends,
  },

  computed: {
    headers() {
      let intialHeaders = [
        // {
        //   text: "Legend",
        //   sortable: false,
        //   value: "legend",
        // },
        {
          text: "Candidate",
          value: "candidateName",
        },
        {
          text: "Party",
          value: "party",
        },
        {
          text: "Vote Total",
          value: "votesCount",
        },
        {
          text: "Vote (%)",
          value: "votePercentage",
        },
      ];

      if (this.position.isTieOccured) {
        intialHeaders = [
          {
            text: "Tie",
            value: "tie",
          },

          ...intialHeaders,
        ];
      }

      return intialHeaders;
    },
    maxWinner(): number {
      return this.position.max_selected;
    },
  },
});
</script>

<style>
</style>