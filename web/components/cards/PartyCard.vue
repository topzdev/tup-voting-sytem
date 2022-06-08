<template>
  <v-card style="overflow: hidden" :to="partyRoute">
    <v-row no-gutters>
      <v-col cols="12">
        <v-card min-height="70px" flat color="grey lighten-4">
          <app-image
            v-if="party.cover_photo"
            max-height="100%"
            width="100%"
            :height="70"
            :src="party.cover_photo"
          ></app-image>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        class="px-3 pb-2 d-flex align-end"
        style="margin-top: -30px"
      >
        <!-- <v-avatar size="70">
          <app-image :size="70" :src="party.logo" :alt="party.title" />
        </v-avatar> -->

        <app-avatar
          :size="70"
          :src="party.logo"
          :alt="party.title"
          :borderWidth="2"
        >
        </app-avatar>

        <h2 class="title text-truncate text--primary ml-2" :title="title">
          {{ party.title }}

          <span class="text--secondary font-weight-bold">
            ({{ party.ticker }})
          </span>
        </h2>
      </v-col>
      <v-col
        v-if="showElection && party.election"
        class="px-2 py-2 pb-3"
        cols="12"
      >
        <election-chip :election="party.election" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Election, Party } from "@/types/app";
import AppImage from "@/components/app/AppImage.vue";
import ElectionChip from "@/components/chips/ElectionChip.vue";
import pageRoutes from "@/configs/page-routes";
import AppAvatar from "@/components/app/AppAvatar.vue";

export default Vue.extend({
  components: { AppImage, ElectionChip, AppAvatar },
  props: {
    showElection: {
      type: Boolean,
      default: true,
    },
    party: {
      type: Object,
    } as PropOptions<Party>,
  },

  computed: {
    election(): Election | null {
      if (!this.party.election) return null;
      return this.party.election;
    },

    partyRoute(): string {
      if (!this.election) return "";
      return pageRoutes.party(this.election.slug, this.party.id);
    },
    title(): string {
      return `${this.party.title} (${this.party.ticker})`;
    },
  },
});
</script>

<style lang="scss">
.party-card {
  &__logo {
  }
}
</style>