<template>
  <span>
    <page-bars title="Party">
      <v-btn
        v-if="hideByStatus(pageStatus.candidate.create)"
        color="primary"
        class="mr-2 ml-auto"
        @click="createPartyRoute"
        large
        >New Party</v-btn
      >
    </page-bars>
    <manage-container>
      <party-list />
    </manage-container>
  </span>
</template>


<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import ManageContainer from "@/components/containers/ManageContainer.vue";
import partyMixins from "@/mixins/party.mixin";
import PartyList from "@/components/pages/party/PartyList.vue";
import restrictionsMixin from "@/mixins/restrictions.mixin";
import manageElectionMixins from "@/mixins/manage-election.mixins";
export default mixins(
  partyMixins,
  restrictionsMixin,
  manageElectionMixins
).extend({
  components: {
    PageBars,
    ManageContainer,
    PartyList,
  },

  computed: {
    pageTitle(): string {
      return this.links.party.title;
    },

    toolbarTitle(): string {
      return this.links.party.toolbarTitle || this.pageTitle;
    },
  },
  head(): any {
    return {
      title: this.pageTitle,
    };
  },
});
</script>

<style>
</style>