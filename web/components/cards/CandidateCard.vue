<template>
  <v-card elevation="1" :to="candidateRoute" :title="fullname">
    <v-list-item>
      <v-list-item-avatar size="60">
        <app-image :size="75" :alt="fullname" :src="candidate.profile_photo" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title
          class="font-weight-bold text-capitilize"
          v-text="fullname"
        >
        </v-list-item-title>
        <v-list-item-subtitle>
          <party-chip
            outlined
            class="mt-2"
            :data="candidate.party"
          ></party-chip>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Candidate } from "@/types/app";
import PartyChip from "@/components/chips/PartyChip.vue";
import pageRoutes from "../../configs/page-routes";

export default Vue.extend({
  components: {
    PartyChip,
  },
  props: {
    candidate: {
      type: Object,
    } as PropOptions<Candidate>,
  },

  computed: {
    candidateRoute(): string {
      if (!this.candidate.election) return "";
      return pageRoutes.candidate(
        this.candidate.election.slug,
        this.candidate.id
      );
    },

    fullname(): string {
      return `${this.candidate.lastname}, ${this.candidate.firstname} ${this.candidate.middlename}`;
    },
  },
});
</script>

<style>
</style>