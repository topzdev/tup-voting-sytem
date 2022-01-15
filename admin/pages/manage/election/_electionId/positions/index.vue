<template>
  <span>
    <page-bars title="Positions">
      <v-btn
        v-if="itemsCount"
        color="primary"
        class="mr-2 ml-auto"
        :to="createPositionRoute()"
        large
        >New Position</v-btn
      >
    </page-bars>
    <manage-container>
      <template v-slot:states>
        <div v-if="$fetchState.pending">Loading...</div>
        <div v-else-if="$fetchState.error">Something went wrong</div>
        <position-empty v-else-if="!itemsCount" />
      </template>
      <template v-slot:centered>
        <position-list
          v-if="!$fetchState.pending && !$fetchState.error && itemsCount"
          :items="items"
        />
      </template>
    </manage-container>
  </span>
</template>


<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import positionMixins from "@/mixins/position.mixins";
import PositionList from "@/components/pages/positions/PositionList.vue";
import PositionEmpty from "@/components/pages/positions/PositionEmpty.vue";
import ManageContainer from "@/components/containers/ManageContainer.vue";
import positionService from "@/services/position.service";
import manageElectionMixins from "../../../../../mixins/manage-election.mixins";

export default mixins(manageElectionMixins, positionMixins).extend({
  components: {
    PageBars,
    PositionList,
    PositionEmpty,
    ManageContainer,
  },
  head: {
    title: "Positions",
  },
  data() {
    return {
      loading: true,
      items: [] as any,
      totalCount: 0,
      itemsCount: 0,
      search: "",
    };
  },
  fetchOnServer: false,
  async fetch() {
    await this.fetchItems();
  },

  methods: {
    async fetchItems() {
      if (!this.electionId) return;
      this.loading = true;
      try {
        const result = await positionService.getAll(this.electionId, {});
        this.items = result.items;
        this.totalCount = result.itemsCount;
        this.itemsCount = result.totalCount;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
});
</script>

<style>
</style>