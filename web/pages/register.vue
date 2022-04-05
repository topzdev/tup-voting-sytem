<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="register" color="primary"
          >Pre-Register with Google</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  methods: {
    register() {
      this.$auth.loginWith("google", { params: { prompt: "select_account" } });
    },
  },
});
</script>

<style>
</style>