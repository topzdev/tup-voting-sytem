<template>
  <v-row style="height: 100%">
    <v-col v-if="list.loading" class="text-center" cols="12">
      <app-loading></app-loading>
    </v-col>

    <template v-if="!list.loading">
      <v-col cols="6" class="mx-auto" v-if="list.pagination.total">
        <v-row no-gutters class="my-4">
          <template v-if="list.items.length">
            <v-col
              v-for="item in list.items"
              :key="item.id"
              cols="12"
              class="mb-3"
            >
              <party-card :data="item" />
            </v-col>
          </template>

          <v-col v-else class="text-center" cols="12"> No items found </v-col>
        </v-row>
      </v-col>

      <v-col
        v-else
        class="mx-auto text-center d-flex align-center justify-center h-100"
        md="5"
      >
        <party-empty />
      </v-col>
    </template>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import PartyCard from "@/components/pages/party/cards/PartyCard.vue";
import PartyEmpty from "@/components/pages/party/PartyEmpty.vue";
import partyService, { Party } from "@/services/party.service";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "../../../mixins/manage-election.mixins";
import AppLoading from "@/components/app/AppLoading.vue";
export default mixins(manageElectionMixins).extend({
  components: {
    PartyCard,
    PartyEmpty,
    AppLoading,
  },

  data() {
    return {
      list: {
        loading: true,
        items: [] as Party[],
        search: "",
        pagination: {
          page: 1,
          perPage: 10,
          total: 0,
          itemsPerPageOptions: [5, 10, 15, 20],
        },
      },
    };
  },
  fetchOnServer: false,
  async fetch() {
    await this.fetchItems();
  },

  methods: {
    async fetchItems() {
      this.list.loading = true;

      if (!this.electionId) return;

      try {
        const result = await partyService.getAll(this.electionId, {});
        console.log(result);
        this.list.items = result.items;
        this.list.pagination.total = result.totalCount;
      } catch (error) {
        console.log(error);
      } finally {
        this.list.loading = false;
      }
    },
  },
});
</script>

<style>
</style>