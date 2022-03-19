<template>
  <page-center style="min-height: 70vh">
    <v-row>
      <v-col class="d-flex align-center text-center flex-column" md="12">
        <!-- <app-image src=""></app-image> -->
        <app-image
          :src="require('~/assets/images/vote-submitted.png')"
          alt=""
        />

        <p class="my-3">Vote Submitted</p>

        <h1 class="display-2 font-weight-bold text--primary mx-auto mb-4">
          Thank you for voting!
        </h1>

        <v-btn color="primary" large class="mt-2 mb-2" @click="show = true">
          View Ballot Receipt
        </v-btn>
        <v-btn text color="primary" width="200" large> Logout </v-btn>
      </v-col>
    </v-row>
    <ballot-receipt-dialog :show="show" />
  </page-center>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import AppImage from "@/components/app/AppImage.vue";
import PageCenter from "@/components/utils/PageCenter.vue";
import BallotReceiptDialog from "@/components/pages/ballot/dialogs/BallotReceiptDialog.vue";
export default Vue.extend({
  components: { AppImage, PageCenter, BallotReceiptDialog },
  data() {
    return {
      show: false,
    };
  },
});
</script>

<style>
</style>