<template>
  <v-card outlined :loading="$fetchState.pending">
    <v-card-title class="d-flex w-100">
      Check Ballot Details
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            large
            v-bind="attrs"
            v-on="on"
            @click="fetchBallot"
            class="ml-auto"
          >
            <v-icon> mdi-refresh </v-icon>
          </v-btn>
        </template>
        <span>Refresh</span>
      </v-tooltip>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text v-if="ballot && ballot.length" class="pb-0">
      <template v-for="(item, idx) in ballot">
        <v-card :key="item.id" outlined flat class="mb-3">
          <v-card-title class="grey lighten-5 mb-3 py-2">
            <v-avatar size="34" class="mr-2" color="grey lighten-3">
              {{ idx + 1 }}
            </v-avatar>
            <h2 class="title text--primary" v-text="item.title"></h2>

            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" class="ml-auto">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item
                  dense
                  target="_blank"
                  :to="editPositionRoute(item.id)"
                >
                  <v-list-item-title>Edit Position</v-list-item-title>
                </v-list-item>
                <v-list-item dense target="_blank" :to="createCandidateRoute()">
                  <v-list-item-title>Add Candidate</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <!-- <v-btn
              icon
              small
              color="default"
              class="ml-auto"
              :to="editPositionRoute(item.id)"
            >
              <v-icon small>mdi-pencil</v-icon>
            </v-btn> -->
          </v-card-title>

          <v-card-text class="text--primary pb-0">
            <h3 class="mb-2">Rules</h3>
            <ul>
              <li
                v-for="(rule, idx) in ballotRules(
                  item.min_selected,
                  item.max_selected
                )"
                :key="idx"
                v-html="rule"
              ></li>
            </ul>
          </v-card-text>

          <v-card-text
            class="text--primary"
            v-if="item.candidates && item.candidates.length"
          >
            <h3 class="mb-2">Options</h3>
            <v-row no-gutters>
              <v-col cols="12">
                <v-row>
                  <v-col
                    v-for="(candidates, idx) in item.candidates"
                    :key="idx"
                    cols="4"
                  >
                    <candidates-card :data="candidates" />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-subtitle v-else>
            <p text dense class="body-2 mb-0 warning--text">
              <v-row align="center">
                <v-col class="grow">
                  This position will not be shown on voting platform since it
                  has <b>no candidates added in this position</b>
                  <v-btn
                    color="primary"
                    class="text-decoration-underline text-capitalize"
                    small
                    target="_blank"
                    text
                    :to="createCandidateRoute()"
                    >Add Candidate</v-btn
                  >
                </v-col>

                <v-col class="shrink"> </v-col>
              </v-row>
            </p>
          </v-card-subtitle>
        </v-card>
      </template>

      <v-row class="mt-4" no-gutters>
        <v-col cols="auto">
          <v-alert class="mb-0" color="warning" dense text>
            <v-checkbox
              dense
              class="my-0"
              color="warning"
              v-model="valid"
              hide-details="auto"
              label="I understand that I cannot change my ballot after the election starts"
            ></v-checkbox>
          </v-alert>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-btn @click="back" text large> Back </v-btn>
      <v-btn
        :disabled="!valid"
        color="primary"
        @click="submit"
        class="ml-auto"
        large
      >
        Continue
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import CandidatesCard from "@/components/cards/CandidatesCard.vue";
import candidateMixin from "@/mixins/candidate.mixin";
import positionsMixin from "@/mixins/position.mixins";
import launchpadServices, {
  LaunchpadElectionBallot,
} from "@/services/launchpad.services";
import dayjs from "dayjs";
import mixins from "vue-typed-mixins";
import AppImage from "@/components/app/AppImage.vue";
export default mixins(candidateMixin, positionsMixin).extend({
  components: {
    AppImage,
    CandidatesCard,
  },
  props: {
    toPage: Function,
    next: Function,
    back: Function,
    electionId: Number,
  },

  data() {
    return {
      valid: false,
      ballot: null as LaunchpadElectionBallot | null,
    };
  },

  fetchOnServer: false,
  async fetch() {
    await this.fetchBallot();
  },

  methods: {
    formDate(date: string) {
      return dayjs(date).format("ddd, MMMM DD, YYYY hh:mm a");
    },

    async fetchBallot() {
      if (!this.electionId) return;

      try {
        const data = await launchpadServices.getElectionBallot(this.electionId);

        console.log(data);

        this.ballot = data;
      } catch (error) {}
    },

    ballotRules(min_selected: number, max_selected: number) {
      let rules: string[] = [];

      if (min_selected <= 0) {
        rules.push("Voters <b>are not</b>required to select an option.");
      } else {
        rules.push(
          `Voters are required to select a <b>minimum of ${min_selected}</b> candidate option(s)`
        );
      }

      rules.push(`Voter can select  <b>only ${max_selected}</b> option`);

      return rules;
    },

    submit() {
      if (!this.valid) return;

      this.toPage(3);
    },
  },
});
</script>

<style>
</style>