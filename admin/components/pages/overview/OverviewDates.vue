<template>
  <v-row>
    <v-col cols="6">
      <v-card elevation="1">
        <v-card-title class="title py-2"> Start Date </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="body-1" v-text="startDate"> </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card elevation="1">
        <v-card-title class="title py-2"> Close Date </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="body-1" v-text="endDate"> </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { OverviewDetails } from "@/services/overview.service";
import dayjs from "dayjs";
export default Vue.extend({
  props: {
    overviewDates: {
      type: Object,
    } as PropOptions<Pick<OverviewDetails, "start_date" | "close_date">>,
  },

  computed: {
    startDate(): string {
      if (!this.overviewDates) return "";
      return dayjs(this.overviewDates.start_date).format(
        "MMMM DD, YYYY - hh:mm a"
      );
    },
    endDate(): string {
      if (!this.overviewDates) return "";
      return dayjs(this.overviewDates.close_date).format(
        "MMMM DD, YYYY - hh:mm a"
      );
    },
  },
});
</script>

<style>
</style>