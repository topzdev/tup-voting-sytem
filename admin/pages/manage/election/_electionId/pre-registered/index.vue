<template>
  <span>
    <page-bars :backTo="backToVotersPage" title="Pre-registered Voters">
    </page-bars>

    <v-container>
      <pre-registered-table />
    </v-container>
  </span>
</template>

<script lang="ts">
import restrictionsMixin from "@/mixins/restrictions.mixin";
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import PreRegisteredTable from "~/components/pages/voters/tables/PreRegisteredTable.vue";
import manageElectionMixins from "~/mixins/manage-election.mixins";
import votersMixin from "~/mixins/voters.mixin";
export default mixins(
  votersMixin,
  manageElectionMixins,
  restrictionsMixin
).extend({
  components: { PageBars, PreRegisteredTable },

  computed: {
    pageTitle(): string {
      return "Pre-Registered";
    },

    toolbarTitle(): string {
      return this.links.voters.toolbarTitle || this.pageTitle;
    },

    backToVotersPage(): string {
      return `voters/`;
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