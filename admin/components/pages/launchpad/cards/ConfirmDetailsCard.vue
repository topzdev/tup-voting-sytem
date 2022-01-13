<template>
  <v-card outlined :loading="$fetchState.pending">
    <v-card-title> Confirm Election Details </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-simple-table v-if="!$fetchState.pending && details">
        <template v-slot:default>
          <tbody>
            <tr>
              <td>
                <h3>Logo</h3>
              </td>
              <td class="py-2">
                <v-avatar size="65">
                  <app-image :size="65" :src="details.logo"></app-image>
                </v-avatar>
              </td>

              <td class="text-right">
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <h3>Title</h3>
              </td>
              <td>
                <p
                  class="body-1 mb-0 text-capitlize"
                  v-text="details.title"
                ></p>
              </td>
              <td class="text-right">
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </td>
            </tr>

            <tr>
              <td>
                <h3>Slug</h3>
              </td>
              <td>
                <p class="body-1 mb-0" v-text="details.slug"></p>
              </td>
              <td class="text-right">
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </td>
            </tr>

            <tr>
              <td>
                <h3>Start Date</h3>
              </td>
              <td>
                <p
                  class="body-1 mb-0"
                  v-text="formDate(details.start_date)"
                ></p>
              </td>

              <td class="text-right">
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </td>
            </tr>

            <tr>
              <td>
                <h3>Close Date</h3>
              </td>
              <td>
                <p
                  class="body-1 mb-0"
                  v-text="formDate(details.close_date)"
                ></p>
              </td>

              <td class="text-right">
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" @click="toPage(2)" class="ml-auto" large>
        Continue
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import AppImage from "../../../app/AppImage.vue";
import launchpadServices, {
  LaunchpadElectionDetails,
} from "@/services/launchpad.services";
import dayjs from "dayjs";

export default Vue.extend({
  components: {
    AppImage,
  },
  props: {
    toPage: Function,
    next: Function,
    back: Function,
    electionId: Number,
  },

  data() {
    return {
      details: null as LaunchpadElectionDetails | null,
    };
  },

  fetchOnServer: false,
  async fetch() {
    await this.fetchDetails();
  },

  methods: {
    formDate(date: string) {
      return dayjs(date).format("ddd, MMMM DD, YYYY hh:mm a");
    },

    async fetchDetails() {
      if (!this.electionId) return;

      try {
        const data = await launchpadServices.getElectionDetails(
          this.electionId
        );

        console.log(data);
        this.details = data;
      } catch (error) {}
    },
  },
});
</script>

<style>
</style>