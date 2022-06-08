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
      <organization-empty />
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
                label="Search organization by title or ticker"
                single-line
                hide-details
                outlined
              ></v-text-field>
            </v-col>
            <v-col> </v-col>
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
            <organization-card :data="item" />
          </v-col>
        </template>

        <v-col
          v-else-if="!list.loading && !list.items.length"
          class="text-center"
          cols="12"
        >
          No organization found
        </v-col>
      </v-row>
    </v-col>

    <v-col v-else-if="$fetchState.error"> Something went wrong </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import OrganizationCard from "./cards/OrganizationCard.vue";
import OrganizationEmpty from "@/components/pages/org/OrganizationEmpty.vue";
import AppLoading from "@/components/app/AppLoading.vue";
import debounce from "debounce";
import organizationServices, {
  Organization,
} from "@/services/organization.service";

export default Vue.extend({
  components: {
    OrganizationCard,
    OrganizationEmpty,
    AppLoading,
  },

  data() {
    return {
      totalCount: 0,
      list: {
        loading: true,
        items: [] as Organization[] | null,
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
        const result = await organizationServices.getAll({
          search: this.list.search,
          withArchive: true,
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
    ["list.search"]: debounce(async function () {
      // @ts-ignore
      await this.fetchItems();
    }, 500),
  },
});
</script>

<style>
</style>