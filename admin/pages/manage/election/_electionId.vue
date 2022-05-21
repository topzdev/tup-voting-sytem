<template>
  <div v-if="$fetchState.pending">Loading...</div>
  <div v-else-if="$fetchState.error">Something went wrong</div>
  <nuxt-child v-else />
</template>


<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import themeMixin from "~/mixins/theme.mixin";
import { Organization } from "@/services/organization.service";
export default mixins(themeMixin).extend({
  auth: true,
  layout: "manage-election",
  middleware: ["status"],
  watch: {
    organization: {
      immediate: true,
      handler: function (value) {
        this.updateTheme();
      },
    },
  },
  fetchOnServer: false,

  methods: {
    updateTheme() {
      if (!this.organization) return;
      this.changeTheme(this.organization.theme);
    },
  },

  computed: {
    organization(): Organization | null {
      return this.$accessor.manageElection.organization;
    },
  },

  async fetch() {
    const id = this.$route.params.electionId;
    await this.$accessor.manageElection.fetchElection(parseInt(id));
    this.updateTheme();
  },

  mounted() {
    this.updateTheme();
  },

  destroyed() {
    this.changeTheme();
  },
});
</script>


<style>
</style>