<template>
  <v-card outlined :loading="loading">
    <v-card-title class="d-flex w-100"> Terms </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
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
import Vue from "vue";
import AppImage from "../../../app/AppImage.vue";

import dayjs from "dayjs";
import launchpadServices from "../../../../services/launchpad.services";

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
      loading: false,
      valid: false,
    };
  },

  methods: {
    formDate(date: string) {
      return dayjs(date).format("ddd, MMMM DD, YYYY hh:mm a");
    },

    async submit() {
      if (!this.valid) return;
      this.loading = true;
      try {
        const result = await launchpadServices.launchElection(this.electionId);
        this.$accessor.snackbar.set({
          show: true,
          message: "Election Successfully Launched",
          timeout: 10000,
          color: "success",
        });
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<style>
</style>