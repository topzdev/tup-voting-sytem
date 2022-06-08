<template>
  <v-row style="height: 100%">
    <v-col v-if="$fetchState.pending" class="d-flex justify-center" cols="12">
      <app-loading></app-loading>
    </v-col>

    <v-col
      v-else-if="!$fetchState.pending && !totalCount"
      class="mx-auto text-center d-flex align-center justify-center h-100"
      md="5"
    >
      <election-empty />
    </v-col>

    <v-col
      cols="8"
      class="mx-auto"
      v-if="!$fetchState.pending && totalCount && list.items"
    >
      <v-row no-gutters class="mb-4">
        <v-col cols="12">
          <v-row>
            <v-col cols="5" class="mb-4">
              <v-text-field
                v-model="list.search"
                :loading="list.loading"
                append-icon="mdi-magnify"
                label="Search election by title"
                single-line
                hide-details
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="auto" class="ml-auto">
              <v-checkbox
                class="ml-auto"
                v-model="list.withArchive"
                label="Show Archived"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-col>

        <v-col v-if="list.loading" class="text-center" cols="12">
          <app-loading></app-loading>
        </v-col>

        <template v-else-if="!list.loading && list.items.length">
          <v-col
            v-for="item in list.items"
            :key="item.id"
            cols="12"
            class="mb-3"
          >
            <election-card :data="item" />
          </v-col>
        </template>

        <v-col
          v-else-if="!list.loading && !list.items.length"
          class="text-center"
          cols="12"
        >
          No election found
        </v-col>
      </v-row>
    </v-col>
    <v-col v-else-if="$fetchState.error"> Something went wrong </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import ElectionCard from "./cards/ElectionCard.vue";
import electionServices, { Election } from "@/services/election.service";
import ElectionEmpty from "@/components/pages/election/ElectionEmpty.vue";
import AppLoading from "@/components/app/AppLoading.vue";
import mixins from "vue-typed-mixins";
import orgMixin from "@/mixins/org.mixins";
import authMixin from "@/mixins/auth.mixins";
import debounce from "debounce";

export default mixins(orgMixin, authMixin).extend({
  components: {
    ElectionCard,
    ElectionEmpty,
    AppLoading,
  },

  data() {
    return {
      totalCount: 0,
      list: {
        loading: true,
        items: [] as Election[] | null,
        search: "",
        withArchive: false,
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
      try {
        const result = await electionServices.getAll(this.organizationId, {
          search: this.list.search,
          withArchive: this.list.withArchive,
        });

        this.list.items = result.items;
        this.list.pagination.total = result.itemsCount;
        this.totalCount = result.totalCount;
      } catch (error) {
        console.log(error);
      } finally {
        this.list.loading = false;
      }
    },
  },

  watch: {
    ["list.withArchive"]: debounce(async function () {
      // @ts-ignore
      this.fetchItems();
    }, 500),
    ["list.search"]: debounce(async function () {
      // @ts-ignore
      this.fetchItems();
    }, 500),
  },
});
</script>

<style>
</style>