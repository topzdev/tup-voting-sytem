<template>
  <page-center style="min-height: 70vh">
    <v-row>
      <v-col class="d-flex align-center text-center flex-column" md="12">
        <!-- <app-image src=""></app-image> -->
        <app-image
          :src="require('~/assets/images/vote-submitted.png')"
          alt="Vote Submitted"
        />

        <p class="my-3">Vote Submitted</p>

        <h1 class="font-weight-bold text--primary mx-auto mb-4">
          Thank you for voting!
        </h1>
        <!-- <v-btn color="primary" large class="mt-2 mb-2" @click="show = true">
          View Ballot Receipt
        </v-btn> -->
        <v-btn text color="primary" width="200" large @click="ballotLogout">
          Logout
        </v-btn>
      </v-col>
    </v-row>
    <!-- <client-only> -->
    <ballot-receipt-dialog
      v-if="ballotReceipt"
      :receipt="ballotReceipt"
      :show.sync="show"
    />
    <!-- </client-only> -->
  </page-center>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import AppImage from "@/components/app/AppImage.vue";
import PageCenter from "@/components/utils/PageCenter.vue";
import BallotReceiptDialog from "@/components/pages/ballot/dialogs/BallotReceiptDialog.vue";
import mixins from "vue-typed-mixins";
import ballotMixins from "@/mixins/ballot.mixins";
import pageRoutes from "@/configs/page-routes";
export default mixins(ballotMixins).extend({
  validate({ $accessor, route, redirect }) {
    const slug = route.params.slug;
    if (
      $accessor.ballot.allPositionIsRequired &&
      !$accessor.ballot.votes.length
    ) {
      redirect(pageRoutes.voting(slug).ballot().route);
    } else if (!$accessor.ballot.ballotReceipt) {
      redirect(pageRoutes.voting(slug).review().route);
    }
    return true;
  },

  components: { AppImage, PageCenter, BallotReceiptDialog },
  data() {
    return {
      show: true,
    };
  },
});
</script>

<style>
</style>