<template>
  <tr :class="background">
    <td>
      <div class="d-flex align-center">
        <v-avatar size="30">
          <app-image size="30" :src="item.profile_photo"></app-image>
        </v-avatar>

        <span class="ml-2"> {{ item.candidateName }}</span>
      </div>
    </td>
    <td>
      <party-chip :data="item.party"></party-chip>
    </td>
    <td>{{ item.votesCount }}</td>

    <td>{{ item.votePercentage }}%</td>
    <td>
      <div v-if="tie" class="d-flex align-center">
        <v-btn icon color="success">
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
        <v-btn icon color="error">
          <v-icon>mdi-arrow-down</v-icon>
        </v-btn>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import PartyChip from "@/components/chips/PartyChip.vue";
export default Vue.extend({
  components: {
    PartyChip,
  },
  props: {
    item: {
      type: Object,
    },
    tie: {
      type: Boolean,
    },
    in: {
      type: Boolean,
    },
  },

  computed: {
    background(): string {
      if (this.tie) {
        return "light-blue lighten-5";
      } else {
        if (this.in) {
          return "orange lighten-5";
        } else {
          return "blue-grey lighten-5";
        }
      }
    },
  },
});
</script>

<style>
</style>