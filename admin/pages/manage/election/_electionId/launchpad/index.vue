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

export default Vue.extend({
  meta: {
    status: pageStatus.launchpad,
  },

  components: {
    PageBars,
    LaunchpadStepper,
    ManageContainer,
  },
  head: {
    title: "Launchpad",
  },
});
</script>

<style>
</style>