<template>
  <span>
    <page-bars :title="toolbarTitle"> </page-bars>

    <v-container>
      <v-row>
        <v-col cols="12">
          <overview-counts :counts="details" />
        </v-col>

        <v-col cols="6" class="mx-auto">
          <overview-details-component />
        </v-col>
      </v-row>
    </v-container>
  </span>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import OverviewCounts from "@/components/pages/overview/OverivewCounts.vue";
import OverviewDetailsComponent from "~/components/pages/overview/OverviewDates.vue";
import overviewServices, { OverviewDetails } from "@/services/overview.service";
export default mixins(manageElectionMixins).extend({
  components: { PageBars, OverviewCounts, OverviewDetailsComponent },

  data() {
    return {
      details: null as OverviewDetails | null,
    };
  },

  head(): any {
    return {
      title: this.pageTitle,
    };
  },

  computed: {
    pageTitle(): string {
      return this.links.overview.title;
    },

    toolbarTitle(): string {
      return this.links.overview.toolbarTitle || this.pageTitle;
    },
  },

  async fetch() {
    try {
      this.details = await overviewServices.getDetails(this.electionId);
    } catch (error) {}
  },
});
</script>

<style>
</style>