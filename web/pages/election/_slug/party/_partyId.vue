<template>
  <v-row>
    <v-col cols="7" class="mx-auto">
      <v-container v-if="party" class="py-0">
        <v-row>
          <v-col cols="12">
            <party-page-header :party="party" />
          </v-col>

          <v-col cols="12">
            <v-row>
              <v-col cols="8">
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

  async fetch() {
    await this.fetchParty(parseInt(this.partyId));
  },

  methods: {
    async fetchParty(id: number) {
      const response = await publicServices.getParty(id);
      this.party = response.party;
      this.positions = response.positions;
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