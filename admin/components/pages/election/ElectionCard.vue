<template>
  <v-card>
    <v-card-text>
      <v-row no-gutters align="center">
        <v-col cols="auto">
          <v-avatar size="50" :title="election.ticker">
            <img :src="election.logo.url" :alt="election.title" />
          </v-avatar>
        </v-col>
        <v-col class="px-3 d-flex flex-column justify-center text-left">
          <h2
            class="title text-truncate d-inline-block"
            :title="election.title"
          >
            {{ election.title }}
          </h2>
          <p v-if="election.description" class="body-2 my-0 text--secondary">
            {{ election.description }}
          </p>
        </v-col>
        <v-col>
          <v-row class="d-flex align-center">
            <v-col class="">
              <p class="body-2 my-0 text--secondary">Start Date</p>
              <p class="subtitle my-0">
                {{ startDate }}
              </p>
            </v-col>
            <v-col class="">
              <p class="body-2 my-0 text--secondary">End Date</p>
              <p class="subtitle my-0">
                {{ endDate }}
              </p>
            </v-col>
            <v-col>
              <p class="body-2 my-0 text--secondary">Status</p>
              <election-status-chip status="building" :small="true" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-btn color="primary" text :to="`/manage/election/${election.id}`"
            >View</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Election } from "@/services/election.service";
import ElectionStatusChip from "@/components/pages/election/ElectionStatusChip.vue";
import dayjs from "dayjs";

export default Vue.extend({
  props: {
    election: {
      type: Object,
      required: true,
    } as PropOptions<Election>,
  },

  components: {
    ElectionStatusChip,
  },

  computed: {
    startDate() {
      return dayjs(this.election.start_date).format("MM/DD/YYYY - hh:mm a");
    },
    endDate() {
      return dayjs(this.election.close_date).format("MM/DD/YYYY - hh:mm a");
    },
  },
});
</script>

<style>
</style>