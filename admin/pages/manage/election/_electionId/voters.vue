<template>
  <span>
    <page-bars title="Voters">
      <v-spacer />
      <v-btn
        v-if="hideByStatus(pageStatus.voters.import)"
        color="primary"
        class="mr-2"
        outlined
        large
        :to="importVoterRoute"
        >Import Voters</v-btn
      >
      <v-btn
        v-if="hideByStatus(pageStatus.voters.create)"
        color="primary"
        class="mr-2"
        :to="createVoterRoute"
        large
        >Add Voters</v-btn
      >

      <v-menu v-if="hideByStatus(pageStatus.voters.export)" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="exportVoters">
            <v-list-item-title>Export Voters</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </page-bars>

    <v-container>
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
                  <voters-registration-picker
                    v-model="table.filter.registration"
                  />
                </v-col>
                <v-col cols="6" class="pl-2">
                  <voters-availability-picker
                    v-model="table.filter.availability"
                  />
                </v-col>
              </v-row>
            </v-col>

            <v-col
              cols="auto"
              class="d-flex align-center ml-auto justify-center"
            >
              <template v-if="table.selected.length">
                <v-btn
                  v-if="toRemoveVoters.length"
                  large
                  color="error"
                  class="mr-1"
                  @click="removeVoters"
                >
                  Remove
                </v-btn>
                <v-btn
                  v-if="toDisableVoters.length"
                  large
                  color="warning"
                  class="mr-1"
                  @click="disableVoters"
                >
                  Disable ({{ toDisableVoters.length }})</v-btn
                >
                <v-btn
                  v-if="toEnableVoters.length"
                  large
                  color="success"
                  class="mr-1"
                  @click="enableVoters"
                >
                  Enable ({{ toEnableVoters.length }})
                </v-btn>
                <v-btn
                  v-if="
                    hideByStatus(pageStatus.preRegister) && toGrantVoters.length
                  "
                  large
                  color="primary"
                  class="mr-1"
                  @click="grantVoters"
                >
                  Grant ({{ toGrantVoters.length }})
                </v-btn>
              </template>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    large
                    v-bind="attrs"
                    v-on="on"
                    @click="fetchItems"
                  >
                    <v-icon> mdi-refresh </v-icon>
                  </v-btn>
                </template>
                <span>Refresh Table</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-card-title>
        <voters-table
          :table="table"
          :itemsPerPageOptions="itemsPerPageOptions"
        />
      </v-card>
    </v-container>

    <nuxt-child />
  </span>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import VotersTable from "~/components/pages/voters/tables/VotersTable.vue";
import manageElectionMixins from "~/mixins/manage-election.mixins";
import votersMixin from "~/mixins/voters.mixin";
import userServices from "~/services/user.service";
import votersServices, { Voters } from "~/services/voters.service";
import blobDownloader from "~/helpers/blob-downloader.helper";
import restrictionsMixin from "@/mixins/restrictions.mixin";
import pageRoles from "../../../../configs/page-roles";
import authMixin from "../../../../mixins/auth.mixins";
import debounce from "../../../../helpers/debounce";
import VotersAvailabilityPicker from "~/components/pages/voters/pickers/VotersAvailabilityPicker.vue";
import VotersRegistrationPicker from "~/components/pages/voters/pickers/VotersRegistrationPicker.vue";
import pageConfig from "../../../../configs/pages.config";
export default mixins(
  votersMixin,
  manageElectionMixins,
  restrictionsMixin,
  authMixin
).extend({
  components: {
    PageBars,
    VotersTable,
    VotersRegistrationPicker,
    VotersAvailabilityPicker,
  },
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
        sortDesc: [true, true, true],
        sortBy: ["email_address", "firstname", "lastname"],
        filter: {
          registration: "all",
          availability: "all",
        },
      },
    };
  },
  watch: {
    ["$route.query.refresh"]: {
      immediate: true,
      handler: async function (val) {
        await this.fetchItems();
        if (val === "1") {
          this.$router.push({
            query: {
              refresh: undefined,
            },
          });
        }
      },
    },

    ["table.filter"]: {
      deep: true,
      handler: async function () {
        await this.fetchItems();
      },
    },
    ["table.pagination"]: {
      deep: true,
      handler: async function () {
        await this.fetchItems();
      },
    },
    ["table.search"]: debounce(async function () {
      // @ts-ignore
      await this.fetchItems();
    }, 500),
  },

  computed: {
    createVoterRoute(): string {
      if (!this.electionId) return "";
      return pageConfig.voters(this.electionId).create().route;
    },
    importVoterRoute(): string {
      if (!this.electionId) return "";
      return pageConfig.voters(this.electionId).import().route;
    },
    itemsPerPageOptions(): number[] {
      return [5, 10, 15, 20, this.table.pagination.total];
    },

    pageTitle(): string {
      return this.links.voters.title;
    },

    toolbarTitle(): string {
      return this.links.voters.toolbarTitle || this.pageTitle;
    },

    toRemoveVoters(): Voters[] {
      return this.table.selected;
    },

    toDisableVoters(): Voters[] {
      return this.table.selected.filter((item) => item.disabled === false);
    },

    toEnableVoters(): Voters[] {
      return this.table.selected.filter((item) => item.disabled === true);
    },

    toGrantVoters(): Voters[] {
      return this.table.selected.filter(
        (item) => item.is_pre_register === true
      );
    },
  },

  head(): any {
    return {
      title: this.pageTitle,
    };
  },
  methods: {
    async exportVoters() {
      if (!this.electionId) return;

      const data = await votersServices.exportToCsv(this.electionId);

      blobDownloader(
        data,
        `${this.electionInfo?.title}-${Date.now()}`,
        `text/csv`
      );
    },

    async fetchItems() {
      this.table.loading = true;

      if (!this.electionId) return;

      const result = await votersServices.getAll(this.electionId, {
        page: this.table.pagination.page,
        take: this.table.pagination.perPage,
        search: this.table.search,
        availability: this.table.filter.availability,
        registration: this.table.filter.registration,
      });

      this.table.items = result.items;
      this.table.pagination.total = result.totalCount;
      this.table.loading = false;
      this.table.selected = [];
    },

    async disableVoters() {
      const count = this.toDisableVoters.length;

      this.$accessor.system.showAppDialog({
        show: true,
        title: "Disable Voters",
        message: `Are you sure to disable ${count} voters?`,
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            hideDialog();
            if (!this.electionId || !count) return;
            try {
              await votersServices.disable({
                voter_ids: this.toDisableVoters.map((item) => item.id),
                election_id: this.electionId,
              });
              this.$accessor.snackbar.set({
                show: true,
                message: `${count} voters disabled successfully`,
                timeout: 5000,
                color: "success",
              });

              hideDialog();

              await this.fetchItems();

              this.clearSelected();
            } catch (error: any) {
              const message =
                error.response?.data?.error?.message || error.message;

              this.$accessor.snackbar.set({
                show: true,
                message: message,
                timeout: 5000,
                color: "error",
              });
            }
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },

    async enableVoters() {
      const count = this.toEnableVoters.length;
      this.$accessor.system.showAppDialog({
        show: true,
        title: "Enable Voters",
        message: `Are you sure to enable ${count} voters?`,
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            if (!this.electionId || !count) return;
            try {
              await votersServices.enable({
                voter_ids: this.toEnableVoters.map((item) => item.id),
                election_id: this.electionId,
              });

              this.$accessor.snackbar.set({
                show: true,
                message: `${count} voters enabled successfully`,
                timeout: 5000,
                color: "success",
              });
              hideDialog();

              await this.fetchItems();

              this.clearSelected();
            } catch (error: any) {
              console.error(error);
              const message =
                error.response?.data?.error?.message || error.message;

              this.$accessor.snackbar.set({
                show: true,
                message: message,
                timeout: 5000,
                color: "error",
              });
            }
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },

    async removeVoters() {
      const count = this.toRemoveVoters.length;

      this.$accessor.system.showAppDialog({
        show: true,
        title: "Remove Voters",
        message: `Are you sure to remove ${count} voters?`,
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            hideDialog();

            this.systemAuthentication(
              {
                button: {
                  yesFunction: async () => {
                    if (!this.electionId || !count) return;
                    try {
                      await votersServices.remove({
                        voter_ids: this.toRemoveVoters.map((item) => item.id),
                        election_id: this.electionId,
                      });

                      this.$accessor.snackbar.set({
                        show: true,
                        message: `${count} voters removed successfully`,
                        timeout: 5000,
                        color: "success",
                      });

                      await this.fetchItems();
                      this.clearSelected();
                    } catch (error: any) {
                      console.error(error);
                      const message =
                        error.response?.data?.error?.message || error.message;

                      this.$accessor.snackbar.set({
                        show: true,
                        message: message,
                        timeout: 5000,
                        color: "error",
                      });
                    }
                  },
                },
              },
              "current-only-password",
              pageRoles.dialogs.publishResult
            );
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },

    async grantVoters() {
      const count = this.toGrantVoters.length;
      this.$accessor.system.showAppDialog({
        show: true,
        title: "Grant Pre-Registered Voters",
        message: `Are you sure to grant ${count} pre-registered voters?`,
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            if (!this.electionId || !count) return;
            try {
              await votersServices.grantPreRegister(
                this.electionId,
                this.toGrantVoters.map((item) => item.id)
              );

              this.$accessor.snackbar.set({
                show: true,
                message: `${count} pre-registered voters granted successfully`,
                timeout: 5000,
                color: "success",
              });
              hideDialog();

              await this.fetchItems();

              this.clearSelected();
            } catch (error: any) {
              console.error(error);
              const message =
                error.response?.data?.error?.message || error.message;

              this.$accessor.snackbar.set({
                show: true,
                message: message,
                timeout: 5000,
                color: "error",
              });
            }
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },

    async clearSelected() {
      this.table.selected = [];
    },
  },
  fetchOnServer: false,
  async fetch() {
    console.log(this.$route);
    await this.fetchItems();
  },
});
</script>

<style>
</style>