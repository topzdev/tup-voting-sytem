<template>
  <v-card :class="activeClass" outlined @[!readonly&&`click`]="toggle(data)">
    <v-icon class="selected__checkmark" color="success" size="30" v-if="active"
      >mdi-check-decagram</v-icon
    >

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
    <v-card-actions v-if="!readonly">
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

    readonly: {
      type: Boolean,
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
      return this.active ? "selected" : "";
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

<style lang="scss" scoped>
.selected {
  outline: 3px solid #4caf50;
  border: none;
  position: relative;
  &__checkmark {
    position: absolute;
    right: -15px;
    top: -15px;
    z-index: 1;
    border-radius: 100%;
    background: #fff;
  }
}
</style>