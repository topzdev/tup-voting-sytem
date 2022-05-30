<template>
  <v-card>
    <v-card-title>
      <v-row align="center">
        <v-col class="d-flex" cols="3">
          <v-text-field
            v-model="table.search"
            append-icon="mdi-magnify"
            label="Search voter by Voter ID, First Name or Last Name"
            single-line
            hide-details
            outlined
          ></v-text-field>
        </v-col>
        <v-col class="d-flex" cols="3">
          <v-row no-gutters>
            <v-col cols="6">
              <voters-registration-picker v-model="table.filter.registration" />
            </v-col>
            <v-col cols="6" class="pl-2">
              <voters-availability-picker v-model="table.filter.availability" />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="auto" class="d-flex align-center ml-auto">
          <template v-if="table.selected.length">
            <v-btn large color="error"> Remove (6) </v-btn>
            <v-btn large color="orange"> Disable (6) </v-btn>
            <v-btn large color="green"> Enable (6) </v-btn></template
          >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon large v-bind="attrs" v-on="on" @click="fetchItems">
                <v-icon> mdi-refresh </v-icon>
              </v-btn>
            </template>
            <span>Refresh Table</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card-title>

    <v-data-table
      v-model="table.selected"
      :show-select="true"
      :single-select="false"
      :loading="table.loading"
      :headers="headers"
      :items="table.items"
      :server-items-length="table.pagination.total"
      :page.sync="table.pagination.page"
      :items-per-page.sync="table.pagination.perPage"
      :footer-props="{
        'items-per-page-options': itemsPerPageOptions,
      }"
    >
      <template v-slot:item.voted="{ item }">
        <v-icon v-if="item.voted" color="green">mdi-check-all</v-icon>
        <v-icon v-else>mdi-minus-circle-outline</v-icon>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              @click="editVoterRoute(item.id)"
            >
              <v-icon> mdi-pencil </v-icon>
            </v-btn>
          </template>
          <span>Edit Voter</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import debounce from "@/helpers/debounce";
import mixins from "vue-typed-mixins";
import votersMixin from "~/mixins/voters.mixin";
import votersServices, { Voters } from "~/services/voters.service";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import restrictionsMixin from "@/mixins/restrictions.mixin";
import VotersRegistrationPicker from "~/components/pages/voters/pickers/VotersRegistrationPicker.vue";
import VotersAvailabilityPicker from "~/components/pages/voters/pickers/VotersAvailabilityPicker.vue";

export default mixins(
  manageElectionMixins,
  votersMixin,
  restrictionsMixin
).extend({
  components: { VotersRegistrationPicker, VotersAvailabilityPicker },
  data() {
    return {
      table: {
        loading: false,
        selected: [] as Voters[],
        pagination: {
          page: 1,
          perPage: 10,
          total: 0,
          itemsPerPageOptions: [5, 10, 15, 20],
        },
        search: "",
        items: [],
        multiSort: true,
        sortDesc: [true, true, true, true, true],
        sortBy: ["voted", "username", "email_address", "firstname", "lastname"],
        filter: {
          registration: "reg",
          availability: "all",
        },
      },
    };
  },

  computed: {
    itemsPerPageOptions(): number[] {
      return [5, 10, 15, 20, this.table.pagination.total];
    },

    headers() {
      return this.filterByStatus([
        {
          text: "Is Voted",
          value: "voted",
          status: this.pageStatus.voters.table.isVoted,
        },
        {
          text: "Voter ID",
          value: "username",
        },
        {
          text: "Email Address",
          value: "email_address",
        },
        {
          text: "Firstname",
          value: "firstname",
        },
        {
          text: "Lastname",
          value: "lastname",
        },
        {
          text: "Action",
          value: "actions",
          status: this.pageStatus.voters.table.action,
        },
      ]);
    },
  },

  watch: {
    async ["table.pagination.perPage"]() {
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

      const result = await votersServices.getAll(this.electionId, {
        page: this.table.pagination.page,
        take: this.table.pagination.perPage,
        search: this.table.search,
      });

      console.log(result);

      this.table.items = result.items;
      this.table.pagination.total = result.totalCount;
      this.table.loading = false;
    },
  },

  fetchOnServer: false,
  async fetch() {
    await this.fetchItems();
  },
});
</script>

<style>
</style>