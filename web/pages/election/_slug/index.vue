<template>
  <v-row>
    <v-col cols="8" class="mx-auto">
      <v-container v-if="election" class="py-0">
        <v-row>
          <v-col cols="12">
            <election-page-header :election="election" />
          </v-col>

          <v-col v-if="positions" cols="12">
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
import publicServices from "@/services/public";
import ElectionPageHeader from "@/components/pages/election/ElectionPageHeader.vue";
import ElectionPositionCandidates from "@/components/pages/election/ElectionPositionCandidates.vue";
import { Election, Party, Position } from "@/types/app";
import { MetaInfo } from "vue-meta";
import ElectionParty from "@/components/pages/election/ElectionParty.vue";
export default Vue.extend({
  components: {
    ElectionPageHeader,
    ElectionPositionCandidates,
    ElectionParty,
  },

  data() {
    return {
      election: null as Election | null,
      positions: [] as Position[],
      party: [] as Party[],
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

  methods: {
    async fetchElection() {
      const resposne = await publicServices.getElection("");

      this.election = resposne.election;
      this.positions = resposne.positions;
      this.party = resposne.party;
    },
  },
});
</script>

<style>
</style>