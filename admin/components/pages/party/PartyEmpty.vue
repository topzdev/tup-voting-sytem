<template>
  <span>
    <v-icon color="primary" size="100">{{ thisPageConfig.icon }}</v-icon>
    <h1 class="display-2">No Party Yet</h1>
    <p class="mt-3 mx-auto body-1" style="width: 75%">
      Party is important for the voter to know whom they want to elect. You can
      still launch the Election Candidates without party will be automatically
      deemed as Independent.
    </p>
    <v-btn
      v-if="hideByStatus(pageStatus.party.create)"
      color="primary"
      large
      width="75%"
      class="mt-1 mx-auto"
      @click="createPartyRoute"
      >Create Party</v-btn
    >
  </span>
</template>
<script lang="ts">
import mixins from "vue-typed-mixins";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import partyMixin from "~/mixins/party.mixin";
import restrictionsMixin from "../../../mixins/restrictions.mixin";
export default mixins(
  manageElectionMixins,
  partyMixin,
  restrictionsMixin
).extend({
  computed: {
    thisPageConfig() {
      return this.links["party"];
    },
  },
});
</script>

<style>
</style>