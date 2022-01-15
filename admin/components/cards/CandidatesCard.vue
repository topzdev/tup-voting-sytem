<template>
  <v-card outlined>
    <v-list-item>
      <v-list-item-avatar size="75">
        <app-image :size="75" :alt="data.firstname" :src="data.profile_photo" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="font-weight-bold text-capitilize">
          {{ data.firstname }}
          {{ data.lastname }}
        </v-list-item-title>
        <v-list-item-subtitle>
          <party-chip class="mt-2" :data="data.party"></party-chip>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Candidate } from "../../services/candidate.service";
import PartyChip from "@/components/chips/PartyChip.vue";

export default Vue.extend({
  props: {
    data: {
      type: Object,
      required: true,
    } as PropOptions<Candidate>,
  },

  components: {
    PartyChip,
  },
});
</script>

<style>
</style>