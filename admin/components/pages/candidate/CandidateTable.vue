<template>
  <v-row style="height: 100%">
    <v-col v-if="$fetchState.pending" class="text-center" cols="12">
      <app-loading></app-loading>
    </v-col>

    <v-col
      v-else-if="!$fetchState.pending && !table.pagination.total"
      class="mx-auto text-center d-flex align-center justify-center h-100"
      md="5"
    >
      <candidate-empty />
    </v-col>

    <template v-else>
      <v-col cols="12" class="mx-auto" v-if="table.pagination.total">
        <v-card>
          <v-card-title>
            <v-row align="center">
              <v-col cols="3">
                <v-text-field
                  v-model="table.search"
                  append-icon="mdi-magnify"
                  label="Search user by Firstname and Lastname"
                  single-line
                  hide-details
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="2" class="ml-auto">
                <party-picker
                  :prepend="prependParty"
                  placeholder="Filter by Party"
                  :electionId="electionId"
                  v-model="filter.party"
                ></party-picker>
              </v-col>
              <v-col cols="2">
                <position-picker
                  :prepend="prependPosition"
                  placeholder="Filter by Position"
                  :electionId="electionId"
                  v-model="filter.position"
                ></position-picker>
              </v-col>
            </v-row>
          </v-card-title>

          <v-data-table
            :loading="table.loading"
            :headers="table.headers"
            :items="table.items"
            :server-items-length="table.pagination.total"
            :page.sync="table.pagination.page"
            :items-per-page.sync="table.pagination.perPage"
            :footer-props="{
              'items-per-page-options': table.pagination.itemsPerPageOptions,
            }"
          >
            <template v-slot:item.actions="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    :to="editCandidateRoute(item.id)"
                  >
                    <v-icon> mdi-pencil </v-icon>
                  </v-btn>
                </template>
                <span>Edit Candidate</span>
              </v-tooltip>
            </template>
            <template v-slot:item.position="{ item }">
              <span v-if="item.position">{{ item.position.title }}</span>
            </template>

            <template v-slot:item.party="{ item }">
              <party-chip :data="item.party"></party-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </template>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import debounce from "@/helpers/debounce";
import CandidateCard from "@/components/pages/candidate/cards/CandidateCard.vue";
import CandidateEmpty from "@/components/pages/candidate/CandidateEmpty.vue";
import candidateService, { Candidate } from "@/services/candidate.service";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import AppLoading from "@/components/app/AppLoading.vue";
import candidateMixin from "@/mixins/candidate.mixin";
import PositionPicker from "@/components/pickers/PositionPicker.vue";
import PartyPicker from "@/components/pickers/PartyPicker.vue";
import PartyChip from "@/components/chips/PartyChip.vue";
import pageStatus from "../../../configs/page-status.config";
import { statusOnlyAllowed } from "@/helpers/isAllowedByStatus.helper";
import restrictionsMixins from "@/mixins/restrictions.mixin";

export default mixins(
  manageElectionMixins,
  candidateMixin,
  restrictionsMixins
).extend({
  components: {
    CandidateCard,
    CandidateEmpty,
    PositionPicker,
    PartyPicker,
    AppLoading,
    PartyChip,
  },

  data() {
    return {
      table: {
        loading: false,
        headers: [
          {
            text: "First Name",
            value: "firstname",
          },
          {
            text: "Last Name",
            value: "lastname",
          },
          {
            text: "Position",
            value: "position",
          },
          {
            text: "Party",
            value: "party",
          },
          {
            text: "Action",
            value: "actions",
            status: pageStatus.candidate.edit,
          },
        ],
        items: [] as Candidate[],
        search: "",
        pagination: {
          page: 1,
          perPage: 10,
          total: 0,
          itemsPerPageOptions: [5, 10, 15, 20],
        },
      },

      filter: {
        position: "all",
        party: "all",
      },
    };
  },

  computed: {
    prependParty() {
      return [
        { logo: null, id: "all", title: "All" },
        {
          logo: null,
          id: "ind",
          title: "Independent",
        },
      ];
    },
    prependPosition() {
      return [{ id: "all", title: "All" }];
    },
  },

  fetchOnServer: false,
  async fetch() {
    await this.fetchItems();
  },

  watch: {
    async ["filter.position"](val) {
      await this.fetchItems();
    },

    async ["filter.party"](val) {
      await this.fetchItems();
    },

    async ["table.pagination.page"](val) {
      await this.fetchItems();
    },

    ["table.search"]: debounce(async function () {
      // @ts-ignore
      await this.fetchItems();
    }, 500),
  },

  methods: {
    async fetchItems() {
      this.table.loading = true;

      if (!this.electionId) return;

      try {
        const result = await candidateService.getAll(this.electionId, {
          page: this.table.pagination.page,
          take: this.table.pagination.perPage,
          search: this.table.search,
          party: this.filter.party,
          position: this.filter.position,
        });

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