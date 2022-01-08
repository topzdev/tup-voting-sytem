<template>
  <span>
    <page-bars title="Partylist">
      <v-btn
        v-if="itemsCount"
        color="primary"
        class="mr-2 ml-auto"
        @click="createPartyRoute"
        large
        >New Partylist</v-btn
      >
    </page-bars>
    <manage-container>
      <template v-slot:states>
        <div v-if="$fetchState.pending">Loading...</div>
        <div v-else-if="$fetchState.error">Something went wrong</div>
        <party-empty v-else-if="!itemsCount" />
      </template>
      <template v-slot:centered>
        <party-list
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
import partyMixins from "@/mixins/party.mixin";
import PartyList from "@/components/pages/party/PartyList.vue";
import PartyEmpty from "@/components/pages/party/PartyEmpty.vue";
export default mixins(partyMixins).extend({
  components: {
    PageBars,
    PartyList,
    PartyEmpty,
    ManageContainer,
  },
  head: {
    title: "Partylist",
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
            partyName: "Mangboi",
            ticker: "MB",
            description: "Persona Non Grata",
          },
          {
            id: 2,
            partyName: "KPL",
            ticker: "MB",
            description: "Usbong Tumbong",
          },
          {
            id: 3,
            partyName: "DIWA",
            ticker: "MB",
            description: "Hampas Palo",
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