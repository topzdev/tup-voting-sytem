<template>
  <span>
    <page-bars :backTo="backToVotersPage" title="Pre-Registered Voters">
    </page-bars>

    <v-container>
      <pre-registered-table />
    </v-container>
  </span>
</template>

<script lang="ts">
import pageStatus from "@/configs/page-status.config";
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import PreRegisteredTable from "~/components/pages/voters/tables/PreRegisteredTable.vue";
import manageElectionMixins from "~/mixins/manage-election.mixins";
export default mixins(manageElectionMixins).extend({
  components: { PageBars, PreRegisteredTable },

  meta: {
    status: pageStatus.preRegister,
  },

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