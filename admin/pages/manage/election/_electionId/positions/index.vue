<template>
  <span>
    <page-bars title="Positions">
      <v-btn
        v-if="itemsCount"
        color="primary"
        class="mr-2 ml-auto"
        @click="createPositionRoute"
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
export default mixins(positionMixins).extend({
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
      organization: null,
    };
  },
  fetchOnServer: false,
  async fetch() {
    await this.fetchItems();
  },

  methods: {
    async fetchItems() {
      this.loading = true;
      try {
        const result = [{}];

        this.items = [
          {
            id: 1,
            title: "President",
            description: "Highest Poisition",
            max_vote: 1,
            min_vote: 1,
            slot_position: 1,
          },
          {
            id: 2,
            title: "Vice President",
            description: "Second Highest Poisition",
            max_vote: 1,
            min_vote: 1,
            slot_position: 3,
          },
          {
            id: 3,
            title: "Senator",
            description: "Board members of Supreme Court",
            max_vote: 5,
            min_vote: 5,
            slot_position: 2,
          },
        ];
        this.totalCount = 3;
        this.itemsCount = 3;
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