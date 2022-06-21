<template>
  <v-row>
    <v-col md="7" class="mx-auto">
      <v-container v-if="party" class="py-0">
        <v-row>
          <v-col cols="12">
            <party-page-header :party="party" />
          </v-col>

          <v-col cols="12">
            <v-row>
              <v-col md="8">
                <party-position-candidates :positions="positions" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import PartyPageHeader from "@/components/pages/party/PartyPageHeader.vue";
import PartyPositionCandidates from "@/components/pages/party/PartyPositionCandidates.vue";
import publicServices from "@/services/public";
import { Party, Position } from "@/types/app";
import { MetaInfo } from "vue-meta";
import Vue from "vue";

export default Vue.extend({
  components: {
    PartyPageHeader,
    PartyPositionCandidates,
  },
  data() {
    return {
      party: null as Party | null,
      positions: [] as Position[],
    };
  },

  head(): MetaInfo {
    if (!this.party) return {};

    return {
      title: `${this.party.title} (${this.party.ticker}) - ${this.party.election?.title}`,

      meta: [
        {
          name: "description",
          hid: "description",
          content: this.party.description,
        },
      ],
    };
  },

  async fetch() {
    await this.fetchParty(parseInt(this.partyId));
  },

  methods: {
    async fetchParty(id: number) {
      const response = await publicServices.getParty(id);
      const party = response;
      const election = party.election;

      if (!election) return;

      const partialElection = {
        id: election.id,
        title: election.title,
        slug: election.slug,
      };

      const positions = party.positions.map((item) => ({
        ...item,
        candidates: item.candidates?.map((sub) => ({
          ...sub,
          election: partialElection,
        })),
      }));

      this.party = party;
      this.positions = positions as Position[];
    },
  },

  computed: {
    partyId() {
      return this.$route.params.partyId;
    },
  },
});
</script>

<style>
</style>