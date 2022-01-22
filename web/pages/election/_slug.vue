<template>
  <nuxt-child />
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import votingServices from "@/services/voting.services";
import mixins from "vue-typed-mixins";
import ballotMixins from "../../mixins/ballot.mixins";

export default mixins(ballotMixins).extend({
  layout: "ballot",

  async fetch() {
    const slug = this.$route.params.slug;
    await this.$accessor.ballot.fetchElection(slug);
  },

  head() {
    const title: string | undefined =
      this.election?.title || this.electionError?.title;

    return {
      title: "Test",
    };
  },
});
</script>

<style>
</style>