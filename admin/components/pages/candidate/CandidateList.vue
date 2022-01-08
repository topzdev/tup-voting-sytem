<template>
  <v-row style="height: 100%">
    <v-col v-if="table.loading" class="text-center" cols="12">
      <app-loading></app-loading>
    </v-col>

    <template v-if="!table.loading">
      <v-col cols="6" class="mx-auto" v-if="table.pagination.total">
        <v-row no-gutters class="my-4">
          <template v-if="table.items.length">
            <v-col
              v-for="item in table.items"
              :key="item.id"
              cols="12"
              class="mb-3"
            >
              <candidate-card :data="item" />
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
        <candidate-empty />
      </v-col>
    </template>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import CandidateCard from "@/components/pages/candidate/cards/CandidateCard.vue";
import CandidateEmpty from "@/components/pages/candidate/CandidateEmpty.vue";
import candidateService, { Candidate } from "@/services/candidate.service";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "../../../mixins/manage-election.mixins";
import AppLoading from "@/components/app/AppLoading.vue";
export default mixins(manageElectionMixins).extend({
  components: {
    CandidateCard,
    CandidateEmpty,
    AppLoading,
  },

  data() {
    return {
      table: {
        loading: true,
        items: [] as Candidate[],
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
      this.table.loading = true;

      if (!this.electionId) return;

      try {
        const result = await candidateService.getAll(this.electionId, {});

        this.table.items = result.items;
        this.table.pagination.total = result.totalCount;
      } catch (error) {
        console.log(error);
      } finally {
        this.table.loading = false;
      }
    },
  },
});
</script>

<style>
</style>