<template>
  <v-card>
    <v-card-text>
      <v-row no-gutters align="center">
        <v-col cols="auto">
          <v-avatar size="50">
            <app-image :size="50" :src="data.logo" :alt="data.title" />
          </v-avatar>
        </v-col>
        <v-col
          cols="4"
          class="px-3 d-flex flex-column justify-center text-left"
        >
          <h2 class="title text-truncate text--primary" :title="data.title">
            {{ data.title }}
            <publicity-icon :size="20" :value="data.is_public" />
          </h2>
          <p v-if="data.description" class="body-2 my-0 text--secondary">
            {{ trimmedDescription }}
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
              <election-status-chip
                class="font-weight-bold"
                :status="data.final_status"
                dark
                outlined
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-btn color="primary" text :to="manageElectionRoute">View</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Election } from "@/services/election.service";
import ElectionStatusChip from "~/components/chips/ElectionStatusChip.vue";
import dayjs from "dayjs";
import AppImage from "@/components/app/AppImage.vue";
import PublicityIcon from "~/components/icon/PublicityIcon.vue";
import pageConfig from "../../../../configs/pages.config";

export default Vue.extend({
  props: {
    data: {
      type: Object,
      required: true,
    } as PropOptions<Election>,
  },

  components: {
    ElectionStatusChip,
    AppImage,
    PublicityIcon,
  },

  computed: {
    startDate(): string {
      return dayjs(this.data.start_date).format("MM/DD/YYYY - hh:mm a");
    },
    endDate(): string {
      return dayjs(this.data.close_date).format("MM/DD/YYYY - hh:mm a");
    },
    manageElectionRoute(): string {
      return pageConfig.election(this.data.id).this().route;
    },
    trimmedDescription(): string {
      const description = this.data.description;
      return description.length >= 100
        ? description.split("").splice(0, 90).join("") + "..."
        : description;
    },
  },
});
</script>

<style>
</style>