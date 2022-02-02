<template>
  <span>
    <page-bars title="Partylist">
      <v-btn
        v-if="hideByStatus(pageStatus.candidate.create)"
        color="primary"
        class="mr-2 ml-auto"
        @click="createPartyRoute"
        large
        >New Partylist</v-btn
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
export default mixins(partyMixins, restrictionsMixin).extend({
  components: {
    PageBars,
    ManageContainer,
    PartyList,
  },
  head: {
    title: "Partylist",
  },
});
</script>

<style>
</style>