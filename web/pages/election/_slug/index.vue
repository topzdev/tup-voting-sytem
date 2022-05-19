<template>
  <v-row>
    <v-col cols="8" class="mx-auto">
      <v-container v-if="election" class="py-0">
        <v-row>
          <v-col cols="12">
            <election-page-header :election="election" />
          </v-col>

          <v-col cols="12" v-if="tally && tally.length">
            <v-card
              :color="
                election.organization && election.organization.theme.primary
              "
              flat
            >
              <v-card-title>
                <v-icon class="mr-1" color="white">mdi-ballot</v-icon>
                <h3 class="white--text">Election Result</h3></v-card-title
              >
              <v-card-text>
                <election-final-tally :tally="tally" />
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-row>
              <v-col cols="8">
                <election-position-candidates :positions="positions" />
              </v-col>
              <v-col cols="4" class="px-10">
                <election-party :party="party"></election-party>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import publicServices, { FinalTallyPositions } from "@/services/public";
import ElectionPageHeader from "@/components/pages/election/ElectionPageHeader.vue";
import ElectionPositionCandidates from "@/components/pages/election/ElectionPositionCandidates.vue";
import ElectionFinalTally from "@/components/pages/election/ElectionFinalTally.vue";
import { Election, Party, Position } from "@/types/app";
import { MetaInfo } from "vue-meta";
import ElectionParty from "@/components/pages/election/ElectionParty.vue";
export default Vue.extend({
  components: {
    ElectionPageHeader,
    ElectionPositionCandidates,
    ElectionParty,
    ElectionFinalTally,
  },

  data() {
    return {
      election: null as Election | null,
      positions: [] as Position[],
      party: [] as Party[],
      tally: [] as FinalTallyPositions[] | undefined,
    };
  },

  head(): MetaInfo {
    if (!this.election) return {};

    return {
      title: this.election.title,

      meta: [
        {
          name: "description",
          hid: "description",
          content: this.election.description,
        },
      ],
    };
  },

  async fetch() {
    await this.fetchElection();
  },

  computed: {
    slug(): string {
      return this.$route.params.slug;
    },
  },

  methods: {
    async fetchElection() {
      if (!this.slug) return;

      const response = await publicServices.getElection(this.slug);

      const election = response.election;
      const tally = response.tally;
      const partialElection = {
        id: election.id,
        title: election.title,
        slug: election.slug,
      };

      const positions = election.positions.map((item) => ({
        ...item,
        candidates: item.candidates?.map((sub) => ({
          ...sub,
          election: partialElection,
        })),
      }));

      const party = election.party.map((item) => ({
        ...item,
        election: partialElection,
      }));

      this.election = election;
      this.positions = positions as Position[];
      this.party = party as Party[];
      this.tally = tally;
    },
  },
});
</script>

<style>
</style>