<template>
  <v-card outlined :loading="loading">
    <v-card-title class="d-flex w-100"> Terms </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col v-if="previewMode" cols="12">
          <h2 class="title mb-2 text--primary">
            The Election will be in Preview Mode until the election started
          </h2>
          <p class="subtitle-1">
            The voting will start when election reaches {{ start_date }}
          </p>
        </v-col>

        <v-col cols="12">
          <h2 class="title mb-2 text--primary">
            You <span class="error--text">will not be allowed</span> to change
            following after your election launches
          </h2>
          <ul class="subtitle-1 blue--text">
            <li>Add, Edit, or Delete Candidates</li>
            <li>Add, Edit, or Delete Party</li>
            <li>Add, Edit, or Delete Positions</li>
            <li>Change the election start date</li>
          </ul>
        </v-col>

        <v-col cols="12">
          <h3 class="title mb-2 text--primary">
            You <span class="success--text">will be allowed</span> to change
            following after your election launches
          </h3>
          <ul class="subtitle-1 blue--text">
            <li>Add, Edit and Delete Voters</li>
            <li>Extend your election end date</li>
            <li>Close the election</li>
            <li>Send Credentials to voters</li>
            <li>Send "Election has launched" email</li>
            <li>Send "Election has ended" email after election ended</li>
            <li>Allow/Disallow Voters Pre-Registration</li>
          </ul>
        </v-col>
      </v-row>
      <v-checkbox
        color="primary"
        v-model="valid"
        hide-details="auto"
        label="I understand and agree to the privacy policy and terms of service"
      ></v-checkbox>
    </v-card-text>

    <v-card-actions>
      <v-btn @click="back" text large> Back </v-btn>
      <v-btn
        :disabled="!valid"
        color="primary"
        @click="submit"
        class="ml-auto"
        large
      >
        Launch Election
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import AppImage from "@/components/app/AppImage.vue";
import launchpadServices from "@/services/launchpad.services";
import dayjs from "dayjs";
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import overviewMixin from "@/mixins/overview.mixins";
import { Election } from "../../../../services/election.service";

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(overviewMixin).extend({
  components: {
    AppImage,
  },
  props: {
    toPage: Function,
    next: Function,
    back: Function,
    election: Object as PropOptions<Election>,
    electionId: Number,
  },

  data() {
    return {
      loading: false,
      valid: false,
      alert: Object.assign({}, defaultAlert),
    };
  },

  computed: {
    start_date() {
      return dayjs(this.election.start_date).format("MMMM DD, YYYY hh:mm:ss a");
    },
    end_date() {
      return;
    },
    previewMode() {
      return (
        new Date().getTime() < new Date(this.election.start_date).getTime()
      );
    },
  },

  methods: {
    formDate(date: string) {
      return dayjs(date).format("ddd, MMMM DD, YYYY hh:mm a");
    },

    async submit() {
      this.$accessor.system.showAppDialog({
        show: true,
        title: "Launch Election",
        message: "Are you sure to launch this election?",
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            if (!this.valid) return;
            this.loading = true;

            try {
              const result = await launchpadServices.launchElection(
                this.electionId
              );

              await this.$accessor.manageElection.reFetchElection(
                this.electionId
              );

              this.$accessor.snackbar.set({
                show: true,
                message: "Election successfully launched",
                timeout: 10000,
                color: "success",
              });

              this.$router.push(this.overviewPage());
            } catch (error: any) {
              const message =
                error.response?.data?.error?.message || error.message;

              if (message) {
                this.alert = {
                  show: true,
                  type: "error",
                  message: message,
                };
              }
            } finally {
              this.loading = false;
              hideDialog();
            }
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },
  },
});
</script>

<style>
</style>