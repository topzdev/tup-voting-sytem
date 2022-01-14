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
    <v-card-text v-if="ballot && ballot.length">
      <template v-for="(item, idx) in ballot">
        <v-card :key="item.id" outlined flat class="mb-3">
          <v-card-text>
            <v-row no-gutters class="mb-3">
              <v-col cols="12" class="d-flex align-center mb-3">
                <v-avatar size="30" class="white--text mr-2" color="blue">
                  {{ idx + 1 }}
                </v-avatar>
                <h2
                  class="title font-weight-bold text--primary"
                  v-text="item.title"
                ></h2>

                <v-btn
                  icon
                  small
                  color="default"
                  class="ml-auto"
                  @click="editPositionRoute(item.id)"
                >
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </v-col>
              <!-- <v-col cols="12">
            <v-alert type="info" text dense>
              <h4>Rules</h4>
            </v-alert>
          </v-col> -->

              <v-col v-if="item.candidates && item.candidates.length" cols="12">
                <v-row>
                  <v-col
                    v-for="(candidates, idx) in item.candidates"
                    :key="idx"
                    cols="4"
                  >
                    <v-card outlined>
                      <v-list-item>
                        <v-list-item-avatar size="75">
                          <app-image
                            :size="75"
                            :alt="candidates.firstname"
                            :src="candidates.profile_photo"
                          />
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title class="title text-capitilize">
                            {{ candidates.firstname }}
                            {{ candidates.lastname }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            <v-chip class="mt-2" outlined>
                              <template v-if="candidates.party">
                                <v-avatar left>
                                  <app-image
                                    :src="candidates.party.logo"
                                  ></app-image>
                                </v-avatar>
                                {{ candidates.party.title }}
                              </template>
                              <template v-else> Independent </template>
                            </v-chip>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>

              <v-col v-else>
                <v-alert type="warning" text dense class="mb-0">
                  <v-row align="center">
                    <v-col class="grow">
                      This position has no candidates available, on the actual
                      voting platform this position will not be shown in ballot.
                    </v-col>
                    <v-col class="shrink">
                      <v-btn text color="warning" @click="createCandidateRoute"
                        >Add Candidate</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-alert>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </template>

      <v-row>
        <v-col>
          <v-alert color="warning" dense text>
            <v-checkbox
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
import Vue from "vue";
import AppImage from "../../../app/AppImage.vue";
import launchpadServices, {
  LaunchpadElectionBallot,
  LaunchpadElectionDetails,
  LaunchpadValidations,
} from "@/services/launchpad.services";
import dayjs from "dayjs";
import mixins from "vue-typed-mixins";
import candidateMixin from "@/mixins/candidate.mixin";
import positionsMixin from "../../../../mixins/position.mixins";

export default mixins(candidateMixin, positionsMixin).extend({
  components: {
    AppImage,
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

    submit() {
      if (!this.valid) return;

      this.toPage(2);
    },
  },
});
</script>

<style>
</style>