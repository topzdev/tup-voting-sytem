<template>
  <v-row>
    <v-col cols="12" class="pb-0">
      <v-alert type="warning" outlined dense icon="mdi-alert" class="mb-0">
        Resolution of Tie Votes
      </v-alert>
    </v-col>
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
            <result-tie-candidate-row
              v-for="(item, idx) in items"
              :item="item"
              :key="idx"
              :idx="idx"
              :tie="item.tie"
              :in="idx < maxWinner"
              :moveUp="checkIfMoveValid(idx, 'up') ? moveUp : undefined"
              :moveDown="checkIfMoveValid(idx, 'down') ? moveDown : undefined"
            />
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col cols="auto">
          <result-candidate-legends :withTie="true" />
        </v-col>
        <v-col cols="6" class="d-flex align-end ml-auto pt-0">
          <v-row no-gutters>
            <v-col v-if="changesOccured" cols="12">
              <v-text-field
                dense
                class="mb-2"
                rows="3"
                full-width
                hide-details
                outlined
                placeholder="Tie breaker procedure/message"
                v-model="tie_resolved_message"
              >
              </v-text-field>
            </v-col>
            <v-col class="d-flex align-end" cols="12">
              <v-btn
                text
                class="ml-auto mr-1"
                :disabled="!changesOccured"
                @click="reset"
                >Reset</v-btn
              >
              <v-btn :disabled="!changesOccured" color="success" @click="save"
                >Save</v-btn
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import resultsServices, {
  ResultCandidate,
  ResultPositionsWithWinner,
} from "@/services/results.service";
import ResultTieCandidateRow from "./row/ResultTieCandidateRow.vue";
import ResultCandidateLegends from "./ResultCandidateLegends.vue";
import { Position } from "@/services/position.service";
import mixins from "vue-typed-mixins";
import authMixin from "@/mixins/auth.mixins";
import pageRoles from "../../../../configs/page-roles";

export default mixins(authMixin).extend({
  props: {
    position: {
      type: Object,
    } as PropOptions<ResultPositionsWithWinner>,
    candidates: {
      type: Array,
    } as PropOptions<(ResultCandidate & { tie: boolean })[]>,
  },
  components: {
    ResultTieCandidateRow,
    ResultCandidateLegends,
  },

  computed: {
    maxWinner(): number {
      return this.position.max_selected;
    },
  },

  data() {
    return {
      tie_resolved_message: "",
      changesOccured: false,
      items: [] as (ResultCandidate & { tie: boolean })[],
      headers: [
        // {
        //   text: "Legend",
        //   sortable: false,
        //   value: "legend",
        // },
        {
          text: "Tie",
          value: "tied",
        },
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

  methods: {
    save() {
      this.systemAuthentication(
        {
          button: {
            yesFunction: async () => {
              const candidatesWithPos = this.items.map((item, idx) => ({
                candidate_id: item.id,
                pos: idx + 1,
              }));

              console.log(candidatesWithPos);

              const data = {
                election_id: this.position.election_id,
                position_id: this.position.id,
                candidatesWithPos,
                tie_resolved_message: this.tie_resolved_message,
              };

              await resultsServices.resolveTie(data);

              await this.$accessor.electionResult.fetchResults();

              this.$accessor.snackbar.set({
                show: true,
                message: `${this.position.title} Tie Issue Resolved`,
                timeout: 5000,
                color: "success",
              });
            },
          },
        },
        "current-only-password",
        pageRoles.dialogs.resolveTie
      );
    },

    reset() {
      this.$accessor.system.showAppDialog({
        show: true,
        title: "Reset changes",
        message: "Are you sure to reset the changes you made?",
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            this.items = JSON.parse(JSON.stringify(this.candidates));
            this.changesOccured = false;
            hideDialog();
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },

    moveUp(index: number) {
      console.log("Move up");
      let old_index = index;
      let new_index = index - 1;
      this.items = this.array_move(this.items, old_index, new_index);
      this.changesOccured = true;
    },

    moveDown(index: number) {
      let old_index = index;
      let new_index = index + 1;
      this.items = this.array_move(this.items, old_index, new_index);
      this.changesOccured = true;
    },

    checkIfMoveValid(index: number, move: string) {
      let check_index = move === "up" ? index - 1 : index + 1;

      if (check_index < 0 || check_index >= this.items.length) return false;
      console.log(check_index, this.items[check_index].tie);

      return !!this.items[check_index].tie;
    },

    array_move(arr: any[], old_index: number, new_index: number) {
      if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
          arr.push(undefined);
        }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
      return arr; // for testing
    },
  },

  watch: {
    candidates: {
      immediate: true,
      handler: function (value) {
        this.items = JSON.parse(JSON.stringify(value));
      },
    },
  },
});
</script>

<style>
</style>