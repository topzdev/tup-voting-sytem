<template>
  <span>
    <page-bars title="Launch Election"> </page-bars>
    <manage-container>
      <v-row>
        <v-col class="mx-auto" cols="9">
          <launchpad-stepper />
        </v-col>
      </v-row>
    </manage-container>
  </span>
</template>


<script lang="ts">
import Vue, { PropOptions } from "vue";
import PageBars from "@/components/bars/PageBars.vue";
import LaunchpadStepper from "@/components/pages/launchpad/LaunchpadStepper.vue";
import ManageContainer from "@/components/containers/ManageContainer.vue";
import pageStatus from "@/configs/page-status.config";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "@/mixins/manage-election.mixins";

export default mixins(manageElectionMixins).extend({
  meta: {
    status: pageStatus.launchpad,
  },

  components: {
    PageBars,
    LaunchpadStepper,
    ManageContainer,
  },

  computed: {
    pageTitle(): string {
      return this.links.launchpad.title;
    },

    toolbarTitle(): string {
      return this.links.launchpad.toolbarTitle || this.pageTitle;
    },
  },
  head(): any {
    return {
      title: this.pageTitle,
    };
  },
});
</script>

<style>
</style>