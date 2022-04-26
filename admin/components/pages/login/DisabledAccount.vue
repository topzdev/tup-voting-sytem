<template>
  <v-card outlined flat class="px-2 py-4">
    <v-card-text class="text-center text--primary mt-5">
      <v-icon
        color="error"
        size="70"
        class="mb-3"
        v-text="icons.accountDisabled"
      ></v-icon>
      <h2 class="headline font-weight-bold mb-2">Your account was disabled</h2>
      <p class="subtitle-1">
        Your account has been disabled. If you have any questions or concerns
        contact your administrator.
      </p>

      <v-btn color="primary" text @click="reset">Back to login</v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import icons from "@/configs/icons";
export default Vue.extend({
  props: {
    reset: Function,
  },
  data() {
    return {
      icons,
    };
  },
});
</script>

<style>
</style>