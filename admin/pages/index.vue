<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="logo py-4">
        <v-card-text class="d-flex flex-column justify-center">
          <code>
            {{ $auth.user }}
          </code>
          <v-btn color="error" @click="logout()">Logout</v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
vue <script lang="ts">
import Vue from "vue";
import authMixins from "@/mixins/auth.mixins";
export default Vue.extend({
  auth: true,
  mixins: [authMixins],
  head: {
    title: "Dashboard",
  },
});
</script>