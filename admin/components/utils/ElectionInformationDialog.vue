<template>
  <v-dialog v-if="electionInfo" v-model="show" persistent width="550">
    <v-card class="mt-3">
      <v-card-text>
        <v-row>
          <v-col cols="12 pb-0 text-center">
            <v-avatar size="130">
              <app-image :size="130" :src="electionInfo.logo"></app-image>
            </v-avatar>
          </v-col>

          <v-col cols="12" class="text-center">
            <election-status-chip :status="electionInfo.final_status" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-list>
        <v-divider></v-divider>

        <v-row no-gutters>
          <v-col cols="6">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle class="mb-2"
                  >Start Date</v-list-item-subtitle
                >
                <v-list-item-title v-text="formatDate(electionInfo.start_date)">
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle class="mb-2"
                  >Close Date</v-list-item-subtitle
                >
                <v-list-item-title v-text="formatDate(electionInfo.close_date)">
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
        <v-divider></v-divider>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>Election Url</v-list-item-subtitle>
            <v-list-item-title v-html="electionInfo.description">
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>Election Short Url</v-list-item-subtitle>
            <v-list-item-title v-html="electionInfo.description">
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn color="primary" icon>
              <v-icon> {{ icons.clipboard }} </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>Description</v-list-item-subtitle>
            <v-list-item-title v-html="electionInfo.description">
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn color="primary" icon>
              <v-icon> {{ icons.clipboard }} </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>

        <v-row no-gutters>
          <v-col cols="6">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle class="mb-2"
                  >Created Date</v-list-item-subtitle
                >
                <v-list-item-title v-text="formatDate(electionInfo.created_at)">
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle class="mb-2"
                  >Last Update Date</v-list-item-subtitle
                >
                <v-list-item-title v-text="formatDate(electionInfo.updated_at)">
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-list>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="show = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import AppImage from "~/components/app/AppImage.vue";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import ElectionStatusChip from "~/components/chips/ElectionStatusChip.vue";
import dayjs from "dayjs";
import icons from "@/configs/icons";
export default mixins(manageElectionMixins).extend({
  components: {
    AppImage,
    ElectionStatusChip,
  },

  computed: {
    startDate(): string {
      if (!this.electionInfo) return "";
      return dayjs(this.electionInfo.start_date).format(
        "MMMM DD, YYYY - hh:mm a"
      );
    },
    closeDate(): string {
      if (!this.electionInfo) return "";
      return dayjs(this.electionInfo.close_date).format(
        "MMMM DD, YYYY - hh:mm a"
      );
    },
  },

  methods: {
    formatDate(date: string | Date) {
      return dayjs(date).format("MMMM DD, YYYY - hh:mm a");
    },
  },

  data() {
    return {
      show: false,
      icons,
    };
  },
});
</script>

<style>
</style>