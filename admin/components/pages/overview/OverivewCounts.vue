<template>
  <v-row>
    <v-col v-for="item in overviewCounts" :key="item.title">
      <overview-count-card
        :color="item.color"
        :title="item.title"
        :icon="item.icon"
        :count="item.count"
        :progress="item.progress"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import OverviewCountCard from "@/components/pages/overview/cards/OverviewCountCard.vue";
import icons from "@/configs/icons";
import { OverviewDetails } from "@/services/overview.service";
type CountItem = {
  color: string;
  icon: string;
  count: number | string;
  title: string;
  progress?: string | number;
};

export default Vue.extend({
  props: {
    counts: {
      type: Object,
    } as PropOptions<
      Pick<
        OverviewDetails,
        | "votersCount"
        | "partiesCount"
        | "candidatesCount"
        | "positionsCount"
        | "votesCount"
      >
    >,
  },

  components: {
    OverviewCountCard,
  },

  computed: {
    overviewCounts() {
      let localCounts = {
        votersCount: this.counts?.votersCount || 0,
        partiesCount: this.counts?.partiesCount || 0,
        candidatesCount: this.counts?.candidatesCount || 0,
        votesCount: this.counts?.votesCount || 0,
        positionsCount: this.counts?.positionsCount || 0,
      };

      let items: CountItem[] = [];

      items.push({
        title: `Participation (${localCounts.votesCount}/${localCounts.votersCount} Voted)`,
        color: "green lighten-1",
        icon: icons.voteParticipation,
        count: localCounts.votesCount,
        progress:
          (localCounts.votesCount / localCounts.votersCount) * 100 + "%",
      });

      items = [
        ...items,
        {
          title: "Voters",
          color: "blue",
          icon: icons.voters,
          count: localCounts.votersCount,
        },

        {
          title: "Candidates",
          color: "pink darken-2",
          icon: icons.candidates,
          count: localCounts.candidatesCount,
        },

        {
          title: "Parties",
          color: "purple",
          icon: icons.party,
          count: localCounts.partiesCount,
        },

        {
          title: "Positions",
          color: "cyan",
          icon: icons.positions,
          count: localCounts.positionsCount,
        },
      ];

      return items;
    },
  },
});
</script>

<style>
</style>