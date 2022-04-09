<template>
  <span>
    <page-bars :title="toolbarTitle"> </page-bars>

    <v-container>
      <v-row>
        <template v-if="!$fetchState.pending && !$fetchState.error && details">
          <v-col cols="12">
            <overview-counts :counts="details" />
          </v-col>

          <v-col cols="6" class="mx-auto">
            <v-row>
              <v-col cols="12">
                <overview-dates :overviewDates="details" />
              </v-col>

              <v-col cols="12">
                <overview-links :urls="details.urls" />
              </v-col>
            </v-row>
          </v-col>
        </template>
        <template v-else-if="$fetchState.pending">
          <v-col>
            <page-center>
              <app-loading></app-loading>
            </page-center>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </span>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import OverviewCounts from "@/components/pages/overview/OverivewCounts.vue";
import OverviewDates from "~/components/pages/overview/OverviewDates.vue";
import overviewServices, { OverviewDetails } from "@/services/overview.service";
import OverviewLinks from "~/components/pages/overview/OverviewLinks.vue";
import PageCenter from "@/components/utils/PageCenter.vue";
export default mixins(manageElectionMixins).extend({
  components: {
    PageBars,
    OverviewCounts,
    OverviewDates,
    OverviewLinks,
    PageCenter,
  },

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