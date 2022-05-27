<template>
  <v-row v-if="election" class="no-gutters">
    <v-col class="d-flex justify-center mb-3" cols="12">
      <v-avatar size="80">
        <app-image :size="80" :src="election.logo" :alt="election.title" />
      </v-avatar>
    </v-col>
    <v-col>
      <h1 class="headline text-center w-100" style="word-break: break-word">
        {{ election.title }} <br />
        <span class="font-weight-bold">Election</span>
      </h1>
      <p class="text-center body-1">
        {{ election.description }}
      </p>
    </v-col>

    <v-btn
      v-if="showLogout && $auth.loggedIn"
      @click="ballotLogout"
      color="primary"
      text
      style="position: absolute; right: 20px; top: 20px"
      >Logout</v-btn
    >
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Election } from "@/types/app";
import ballotMixins from "@/mixins/ballot.mixins";
import mixins from "vue-typed-mixins";

export default mixins(ballotMixins).extend({
  props: {
    showLogout: {
      type: Boolean,
      default: true,
    },
  },
});
</script>

<style>
</style>