<template>
  <span>
    <page-bars title="Positions">
      <v-btn
        v-if="hideByStatus(pageStatus.candidate.create)"
        color="primary"
        class="mr-2 ml-auto"
        :to="createPositionRoute()"
        large
        >New Position</v-btn
      >
    </page-bars>

    <manage-container>
      <position-list />
    </manage-container>
  </span>
</template>


<script lang="ts">
import ManageContainer from "@/components/containers/ManageContainer.vue";
import PositionEmpty from "@/components/pages/positions/PositionEmpty.vue";
import PositionList from "@/components/pages/positions/PositionList.vue";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import positionMixins from "@/mixins/position.mixins";
import restrictionsMixin from "@/mixins/restrictions.mixin";
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";

export default mixins(
  manageElectionMixins,
  positionMixins,
  restrictionsMixin
).extend({
  components: {
    PageBars,
    PositionList,
    PositionEmpty,
    ManageContainer,
  },

  computed: {
    pageTitle(): string {
      return this.links.positions.title;
    },

    toolbarTitle(): string {
      return this.links.positions.toolbarTitle || this.pageTitle;
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