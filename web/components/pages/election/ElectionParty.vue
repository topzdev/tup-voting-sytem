<template>
  <v-row>
    <v-col cols="12">
      <h2>Party</h2>
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col v-for="item in party" :key="item.id" cols="12">
          <party-card :party="item" :showElection="false" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Party } from "@/types/app";
import PartyCard from "@/components/cards/PartyCard.vue";

export default Vue.extend({
  components: {
    PartyCard,
  },
  props: {
    party: {
      type: Array,
    } as PropOptions<Party[]>,
  },
});
</script>

<style>
</style>