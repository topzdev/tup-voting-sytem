<template>
  <v-row v-if="election" class="no-gutters">
    <v-col class="d-flex justify-center mb-3" cols="12">
      <nuxt-link :to="electionRoute">
        <v-avatar size="80" style="border: 1px solid gray">
          <app-image :size="80" :src="election.logo" :alt="election.title" />
        </v-avatar>
      </nuxt-link>
    </v-col>
    <v-col>
      <nuxt-link :to="electionRoute" class="text-decoration-none text--primary">
        <h1 class="headline text-center w-100" style="word-break: break-word">
          {{ election.title }} <br />
          <span class="font-weight-bold">Election</span>
        </h1>
      </nuxt-link>
      <p v-if="election.description" class="text-center body-1">
        {{ trimmedDescription }}
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
import pageRoutes from "../../../configs/page-routes";

export default mixins(ballotMixins).extend({
  props: {
    showLogout: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    electionRoute(): string {
      if (!this.election) return "/";
      return pageRoutes.election(this.election.slug);
    },

    trimmedDescription(): string {
      if (!this.election) return "";
      const description = this.election.description;
      return description.length >= 100
        ? description.split("").splice(0, 100).join("") + "..."
        : description;
    },
  },
});
</script>

<style>
</style>