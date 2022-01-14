<template>
  <v-stepper flat v-model="step">
    <v-row no-gutters>
      <v-col cols="8" class="mx-auto">
        <v-stepper-header style="box-shadow: none">
          <v-stepper-step :complete="step > 1" step="1" editable>
            Confirm Details
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="step > 2" step="2" editable>
            Check Ballot
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="3" editable> Terms </v-stepper-step>
        </v-stepper-header>
      </v-col>

      <v-col cols="12">
        <v-stepper-items>
          <v-stepper-content step="1">
            <confirm-details-card
              :electionId="electionId"
              :toPage="toPage"
              :next="next"
              :back="back"
            />
          </v-stepper-content>

          <v-stepper-content step="2">
            <check-ballot-card
              :electionId="electionId"
              :toPage="toPage"
              :next="next"
              :back="back"
            />
          </v-stepper-content>

          <v-stepper-content step="3">
            <launchpad-terms-card
              :electionId="electionId"
              :toPage="toPage"
              :next="next"
              :back="back"
            />
          </v-stepper-content>
        </v-stepper-items>
      </v-col>
    </v-row>
  </v-stepper>
</template>

<script lang="ts">
import Vue from "vue";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "../../../mixins/manage-election.mixins";
import ConfirmDetailsCard from "./cards/ConfirmDetailsCard.vue";
import CheckBallotCard from "./cards/CheckBallotCard.vue";
import LaunchpadTermsCard from "./cards/LaunchpadTermsCard.vue";
export default mixins(manageElectionMixins).extend({
  components: {
    ConfirmDetailsCard,
    CheckBallotCard,
    LaunchpadTermsCard,
  },

  data() {
    return {
      step: 3,
      max: 3,
    };
  },

  methods: {
    toPage(page: number) {
      this.step = page;
    },
    next() {
      if (this.step <= this.max) this.step++;
    },
    back() {
      if (this.step >= 1) this.step--;
    },
  },
});
</script>

<style>
</style>