<template>
  <v-row>
    <template v-for="item in overviewCounts">
      <v-col v-if="item.show" :key="item.title">
        <overview-count-card
          :color="item.color"
          :title="item.title"
          :icon="item.icon"
          :count="item.count"
          :progress="item.progress"
        />
      </v-col>
    </template>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import OverviewCountCard from "@/components/pages/overview/cards/OverviewCountCard.vue";
import icons from "@/configs/icons";
import { OverviewDetails } from "@/services/overview.service";
import mixins from "vue-typed-mixins";
import restrictionsMixin from "@/mixins/restrictions.mixin";
type CountItem = {
  color: string;
  icon: string;
  count: number | string;
  title: string;
  progress?: string | number;
  show: boolean;
};

export default mixins(restrictionsMixin).extend({
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
        title: `Participated (${localCounts.votesCount}/${localCounts.votersCount} Voters)`,
        color: "green lighten-1",
        icon: icons.voteParticipation,
        count: localCounts.votesCount,
        progress:
          (localCounts.votesCount / localCounts.votersCount) * 100 + "%",
        show: this.hideByStatus(this.pageStatus.overview.counts.participation),
      });

      items = [
        ...items,
        {
          title: "Voters",
          color: "blue",
          icon: icons.voters,
          count: localCounts.votersCount,
          show: true,
        },

        {
          title: "Candidates",
          color: "pink",
          icon: icons.candidates,
          count: localCounts.candidatesCount,
          show: true,
        },

        {
          title: "Parties",
          color: "purple",
          icon: icons.party,
          count: localCounts.partiesCount,
          show: true,
        },

        {
          title: "Positions",
          color: "cyan",
          icon: icons.positions,
          count: localCounts.positionsCount,
          show: true,
        },
      ];

      return items;
    },
  },
});
</script>

<style>
</style>