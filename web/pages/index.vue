<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-2">Available Elections</h2>

        <v-row>
          <v-col v-for="item in elections" :key="item.id" cols="4">
            <election-card :election="item" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <h2 class="mb-2">Party</h2>

        <v-row>
          <v-col v-for="item in party" :key="item.id" cols="2">
            <party-card :party="item" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts">
import Vue, { PropOptions } from "vue";
import publicServices from "../services/public";
import { Election, Party } from "../types/app";
import ElectionCard from "~/components/cards/ElectionCard.vue";
import PartyCard from "~/components/cards/PartyCard.vue";

export default Vue.extend({
  layout: "public",

  components: {
    ElectionCard,
    PartyCard,
  },

  data() {
    return {
      elections: [] as Election[],
      party: [] as Party[],
    };
  },

  async fetch() {
    await this.fetchElections();
  },

  methods: {
    async fetchElections() {
      const response = await publicServices.getHomepageContent();

      this.elections = response.elections;
      this.party = response.parties;
    },
  },
});
</script>

<style>
</style>

