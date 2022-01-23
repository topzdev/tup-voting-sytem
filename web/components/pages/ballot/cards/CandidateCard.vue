<template>
  <v-card :class="activeClass" outlined @click="toggle">
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
    <v-card-actions>
      <v-btn small color="primary" text @click="moreInfo($event)">
        More Info
      </v-btn>
      <!-- <v-btn
        class="ml-auto"
        small
        color="primary"
        :text="!active"

        :depressed="active"
        v-text="voteText"
      /> -->
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import PartyChip from "@/components/chips/PartyChip.vue";
import { Candidate } from "@/types/app";

export default Vue.extend({
  props: {
    data: {
      type: Object,
      required: true,
    } as PropOptions<Candidate>,
    active: {
      type: Boolean,
    },
    toggle: {
      type: Function,
    },
  },

  components: {
    PartyChip,
  },

  computed: {
    voteText(): string {
      return this.active ? "Voted" : "Vote";
    },

    activeClass(): string {
      return this.active ? "success lighten-5" : "";
    },
  },

  methods: {
    async moreInfo(event: any) {
      event.stopPropagation();
      await this.$accessor.ballot.fetchCandidate(this.data.id);
    },
  },
});
</script>

<style scoped>
</style>