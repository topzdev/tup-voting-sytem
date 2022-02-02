<template>
  <span>
    <v-row class="d-flex align-center py-3">
      <v-col cols="12" class="">
        <p class="body-2 my-0 text--secondary">Start Date</p>
        <p class="subtitle-1 font-weight-bold my-0">
          {{ startDate }}
        </p>
      </v-col>
      <v-col cols="12" class="">
        <p class="body-2 my-0 text--secondary">Close Date</p>
        <p class="subtitle-1 font-weight-bold my-0">
          {{ endDate }}
        </p>
      </v-col>
    </v-row>
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import dayjs from "dayjs";
import manageElectionMixins from "@/mixins/manage-election.mixins";

export default mixins(manageElectionMixins).extend({
  computed: {
    startDate(): string {
      if (!this.electionInfo) return "";
      return dayjs(this.electionInfo.start_date).format("MM/DD/YYYY - hh:mm a");
    },
    endDate(): string {
      if (!this.electionInfo) return "";
      return dayjs(this.electionInfo.close_date).format("MM/DD/YYYY - hh:mm a");
    },
  },
});
</script>

<style>
</style>