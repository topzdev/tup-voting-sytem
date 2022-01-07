<template>
  <span>
    <page-bars title="Sample">
      <v-btn
        v-if="itemsCount"
        color="primary"
        class="mr-2 ml-auto"
        @click="createSampleRoute"
        large
        >New Sample</v-btn
      >
    </page-bars>
    <manage-container>
      <template v-slot:states>
        <div v-if="$fetchState.pending">Loading...</div>
        <div v-else-if="$fetchState.error">Something went wrong</div>
        <sample-empty v-else-if="!itemsCount" />
      </template>
      <template v-slot:centered>
        <sample-list
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
import ManageContainer from "@/components/containers/ManageContainer.vue";
import sampleMixins from "@/mixins/sample.mixin";
import SampleList from "@/components/pages/sample/SampleList.vue";
import SampleEmpty from "@/components/pages/sample/SampleEmpty.vue";
export default mixins(sampleMixins).extend({
  components: {
    PageBars,
    SampleList,
    SampleEmpty,
    ManageContainer,
  },
  head: {
    title: "Sample",
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
            username: "topzdev",
            description: "Highest Poisition 1",
          },
          {
            id: 2,
            username: "harold",
            description: "Highest Poisition 2",
          },
          {
            id: 3,
            username: "errol",
            description: "Highest Poisition  3",
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