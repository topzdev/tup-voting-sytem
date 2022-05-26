  <template>
  <v-data-table
    style="width: 100%"
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
    <template v-slot:item.firstname="{ item }">
      {{ item.firstname }} {{ item.lastname }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon> mdi-account-cancel </v-icon>
          </v-btn>
        </template>
        <span>Enable Officer</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon> mdi-account-reactivate-outline </v-icon>
          </v-btn>
        </template>
        <span>Reset Password</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon> mdi-pencil </v-icon>
          </v-btn>
        </template>
        <span>Edit Information</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon> mdi-delete </v-icon>
          </v-btn>
        </template>
        <span>Delete Officer</span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import AppLoading from "@/components/app/AppLoading.vue";
import PartyChip from "@/components/chips/PartyChip.vue";
import CandidateEmpty from "@/components/pages/candidate/CandidateEmpty.vue";
import CandidateCard from "@/components/pages/candidate/cards/CandidateCard.vue";
import PartyPicker from "@/components/pickers/PartyPicker.vue";
import PositionPicker from "@/components/pickers/PositionPicker.vue";
import debounce from "@/helpers/debounce";
import electionOfficerServices from "@/services/election-officer.service";
import mixins from "vue-typed-mixins";
import manageOrganizationMixin from "@/mixins/manage-organization.mixins";

export default mixins(manageOrganizationMixin).extend({
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
            text: "Name",
            value: "firstname",
          },
          {
            text: "Disabled",
            value: "disabled",
          },
          {
            text: "Actions",
            value: "actions",
            align: "right",
          },
        ],
        items: [],
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

      if (!this.organizationId) return;

      try {
        const result = await electionOfficerServices.getAll({
          page: this.table.pagination.page,
          take: this.table.pagination.perPage,
          search: this.table.search,
          organization_id: this.organizationId,
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
