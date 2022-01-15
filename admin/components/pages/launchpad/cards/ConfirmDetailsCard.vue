<template>
  <v-card outlined :loading="$fetchState.pending">
    <v-card-title class="d-flex w-100">
      Confirm Election Details
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            large
            v-bind="attrs"
            v-on="on"
            @click="fetchDetails"
            class="ml-auto"
          >
            <v-icon> mdi-refresh </v-icon>
          </v-btn>
        </template>
        <span>Refresh</span>
      </v-tooltip>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-alert v-if="validations.errors.length" type="error" text>
        <h3 class="mb-2">Must resolve this issues before continuing.</h3>
        <ul no-gutters>
          <li
            cols="12"
            v-for="(item, idx) in validations.errors"
            :key="idx"
            class="body-1 mt-1"
          >
            <b>{{ item.title }} </b> - {{ item.message }}
          </li>
        </ul>
        <small class="d-inline-block mt-1"
          >*You cannot continue without fixing this issues.
        </small> </v-alert
      ><v-alert v-if="validations.warnings.length" type="warning" text>
        <h3 class="mb-2">Important issues, but not required to do anything.</h3>
        <ul no-gutters class="mt-2">
          <li
            cols="12"
            v-for="(item, idx) in validations.warnings"
            :key="idx"
            class="body-1 mt-1"
          >
            <b>{{ item.title }} </b> - {{ item.message }}
          </li>
        </ul>
      </v-alert>

      <v-alert v-if="validations.infos.length" type="info" text>
        <h3 class="mb-2">Some information about the election.</h3>
        <ul no-gutters>
          <li
            cols="12"
            v-for="(item, idx) in validations.infos"
            :key="idx"
            class="body-1 mt-1"
          >
            <b>{{ item.title }} </b> - {{ item.message }}
          </li>
        </ul>
      </v-alert>

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
      <v-btn
        :disabled="!valid"
        color="primary"
        @click="submit"
        class="ml-auto"
        large
      >
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
  LaunchpadValidations,
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
      valid: false,
      details: null as LaunchpadElectionDetails | null,
      validations: {
        errors: [],
        warnings: [],
        infos: [],
      } as LaunchpadValidations,
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
        const validations = (
          await launchpadServices.getLaunchpadValidations(this.electionId)
        ).validations;

        console.log(data);
        this.details = data;
        this.validations = {
          errors: validations.filter((item) => item.severity === "error"),
          warnings: validations.filter((item) => item.severity === "warning"),
          infos: validations.filter((item) => item.severity === "info"),
        };
      } catch (error) {}
    },

    submit() {
      if (!this.valid) return;

      this.toPage(2);
    },
  },

  watch: {
    ["validations.errors"]: function (value) {
      this.valid = !value.length;
    },
  },
});
</script>

<style>
</style>