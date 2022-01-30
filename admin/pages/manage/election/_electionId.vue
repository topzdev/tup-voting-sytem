<template>
  <div v-if="$fetchState.pending">Loading...</div>
  <div v-else-if="$fetchState.error">Something went wrong</div>
  <nuxt-child v-else />
</template>

<script>
import themeMixin from "~/mixins/theme.mixin";
export default {
  auth: true,
  layout: "manage-election",
  mixins: [themeMixin],
  middleware: ["status"],

  watch: {
    ["$accessor.manageElection.organization"](value) {
      console.log(value.theme);
      this.changeTheme(value.theme);
    },
  },
  fetchOnServer: false,

  async fetch() {
    const id = this.$route.params.electionId;
    await this.$accessor.manageElection.fetchElection(parseInt(id));
  },

  destroyed() {
    this.changeTheme();
  },
};
</script>

<style>
</style>