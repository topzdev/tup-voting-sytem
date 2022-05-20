<template>
  <v-card flat class="px-0 py-0" v-if="winners">
    <v-card-title class="px-0 amber--text darken-4 d-flex align-center">
      <v-icon size="30" color="amber">mdi-license</v-icon>
      <span> Won </span>
    </v-card-title>

    <v-card-text class="px-0">
      <v-row no-gutters>
        <v-col cols="12">
          <v-row>
            <v-col v-for="(item, idx) in winners" :key="item.id" cols="3">
              <winner-card
                :data="item"
                :position="winners && winners.length > 1 ? idx + 1 : null"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import {
  ElectionResult,
  ResultPositionsWithWinner,
} from "@/services/results.service";
import WinnerCard from "@/components/pages/results/cards/WinnerCard.vue";
export default Vue.extend({
  components: {
    WinnerCard,
  },
  props: {
    winners: {
      type: Array,
    } as PropOptions<ResultPositionsWithWinner["winners"]>,
  },
});
</script>

<style>
</style>