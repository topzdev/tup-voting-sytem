<template>
  <nuxt-child />
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import votingServices, {
  ElectionErrorMessage,
} from "@/services/voting.services";
import mixins from "vue-typed-mixins";
import ballotMixins from "../../mixins/ballot.mixins";

export default mixins(ballotMixins).extend({
  layout: "ballot",

  async fetch() {
    const slug = this.$route.params.slug;
    console.log(slug);
    await this.$accessor.ballot.fetchElection(slug);
  },

  head() {
    const title: any =
      this.election?.title &&
      (typeof this.electionError === "string"
        ? this.electionError
        : this.electionError?.title);

    return {
      title: title,
    };
  },
});
</script>

<style>
</style>