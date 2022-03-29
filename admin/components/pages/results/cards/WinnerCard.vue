<template>
  <v-card outlined class="winner-card">
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

    <span v-if="position" class="winner-card__position">{{ position }}</span>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import PartyChip from "@/components/chips/PartyChip.vue";
import { Candidate } from "@/services/candidate.service";

export default Vue.extend({
  props: {
    data: {
      type: Object,
      required: true,
    } as PropOptions<Candidate>,

    position: {
      type: Number,
    },
  },

  components: {
    PartyChip,
  },
});
</script>

<style lang="scss">
$winnerColor: #ffc107;

.winner-card {
  position: relative;
  border-width: 2px !important;
  border-color: $winnerColor !important;

  &__position {
    position: absolute;
    right: 15px;
    top: 50%;
    opacity: 0.3;
    transform: translateY(-50%);
    font-size: 80px;
    font-weight: 700;
    color: $winnerColor;
    font-style: italic;
    user-select: none;
  }
}
</style>
