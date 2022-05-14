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
            <template v-for="(item, idx) in items">
              <result-tie-candidate-row
                :item="item"
                :key="idx"
                :tie="item.tie"
                :in="idx < maxWinner"
              />
            </template>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
    <v-col cols="12">
      <result-tied-legends />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import {
  ResultCandidate,
  ElectionResultWithWinner,
} from "@/services/results.service";
import ResultTieCandidateRow from "./row/ResultTieCandidateRow.vue";
import ResultTiedLegends from "./ResultTiedLegends.vue";
import { Position } from "../../../../services/position.service";

export default Vue.extend({
  props: {
    position: {
      type: Object,
    } as PropOptions<Position>,
    candidates: {
      type: Array,
    } as PropOptions<(ResultCandidate & { tie: boolean })[]>,
  },
  components: {
    ResultTieCandidateRow,
    ResultTiedLegends,
  },

  computed: {
    maxWinner(): number {
      return this.position.max_selected;
    },
  },

  data() {
    return {
      items: [] as (ResultCandidate & { tie: boolean })[],
      headers: [
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
          sortable: false,
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
        {
          text: "Actions",
          value: "action",
        },
      ],
    };
  },

  watch: {
    candidates: {
      immediate: true,
      handler: function (value) {
        this.items = value;
      },
    },
  },
});
</script>

<style>
</style>