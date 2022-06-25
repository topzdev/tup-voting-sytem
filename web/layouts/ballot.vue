<template>
  <v-app dark>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <how-to-vote-dialog />
  </v-app>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import HowToVoteDialog from "@/components/dialogs/HowToVoteDialog.vue";

export default Vue.extend({
  components: {
    HowToVoteDialog,
  },
});
</script>

<style>
</style>