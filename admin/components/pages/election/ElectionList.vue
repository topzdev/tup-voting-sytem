<template>
  <v-row style="height: 100%">
    <v-col v-if="list.loading" class="text-center" cols="12">
      <app-loading></app-loading>
    </v-col>

    <template v-if="!list.loading">
      <v-col cols="8" class="mx-auto" v-if="list.pagination.total">
        <v-row no-gutters class="mb-4">
          <v-col cols="12">
            <v-row>
              <v-col cols="5" class="mb-4">
                <v-text-field
                  v-model="list.search"
                  :loading="list.loading"
                  append-icon="mdi-magnify"
                  label="Search organization by title or ticker"
                  single-line
                  hide-details
                  outlined
                ></v-text-field>
              </v-col>
              <v-col> </v-col>
            </v-row>
          </v-col>

          <template v-if="list.items.length">
            <v-col
              v-for="item in list.items"
              :key="item.id"
              cols="12"
              class="mb-3"
            >
              <election-card :data="item" />
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
        <election-empty />
      </v-col>
    </template>
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
      list: {
        loading: true,
        items: [] as Election[],
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
      try {
        const result = await electionServices.getAll(this.organizationId, {
          search: this.list.search,
          withArchive: true,
        });

        this.list.items = result.items;
        this.list.pagination.total = result.totalCount;
      } catch (error) {
        console.log(error);
      } finally {
        this.list.loading = false;
      }
    },
  },

  watch: {
    ["list.search"]: debounce(async function () {
      // @ts-ignore
      await this.fetchItems();
    }, 500),
  },
});
</script>

<style>
</style>