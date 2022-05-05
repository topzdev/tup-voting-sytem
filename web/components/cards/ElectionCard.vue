<template>
  <v-card :to="toElectionRoute">
    <v-card-text>
      <v-row no-gutters align="center">
        <v-col cols="auto">
          <v-avatar size="75">
            <app-image :size="75" :src="election.logo" :alt="election.title" />
          </v-avatar>
        </v-col>
        <v-col class="pl-2">
          <v-row class="d-flex align-center" no-gutters>
            <v-col cols="12">
              <h2
                class="title text-truncate text--primary"
                :title="election.title"
              >
                {{ election.title }}
              </h2>
            </v-col>
            <v-col cols="12">
              <election-status-chip
                class="font-weight-bold"
                :status="election.final_status"
                dark
                outlined
              />
            </v-col>
            <v-col class="">
              <p class="body mb-0 mt-1">
                <span class="text--secondary">to</span>
                <span class="text--primary"> {{ startDate }}</span>

                <span class="text--secondary">from</span>
                <span class="text--primary"> {{ endDate }}</span>
              </p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Election } from "@/types/app";
import dayjs from "dayjs";
import ElectionStatusChip from "@/components/chips/ElectionStatusChip.vue";
import pageRoutes from "../../configs/page-routes";

export default Vue.extend({
  components: {
    ElectionStatusChip,
  },

  props: {
    election: {
      type: Object,
    } as PropOptions<Election>,
  },
  computed: {
    startDate(): string {
      return dayjs(this.election.start_date).format("MMMM DD, YYYY - hh:mm a");
    },
    endDate(): string {
      return dayjs(this.election.close_date).format("MMMM DD, YYYY - hh:mm a");
    },
    toElectionRoute(): string {
      return pageRoutes.election(this.election.slug);
    },
  },
});
</script>

<style>
</style>