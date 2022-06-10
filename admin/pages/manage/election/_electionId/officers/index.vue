<template>
  <span>
    <page-bars title="Election Officers">
      <v-btn
        color="primary"
        large
        class="ml-auto"
        @click="dialogs.create = true"
        >Add Officer</v-btn
      >
    </page-bars>

    <v-container fluid>
      <v-row>
        <v-col v-if="alert.show" cols="12">
          <v-alert
            :type="alert.type"
            v-model="alert.show"
            dismissible
            class="mb-0"
          >
            {{ alert.message }}
          </v-alert>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-row>
                <v-col class="d-flex" cols="3">
                  <v-text-field
                    v-model="table.search"
                    append-icon="mdi-magnify"
                    label="Search Officer by ID, First Name or Last Name"
                    single-line
                    hide-details
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-title>

            <election-officer-table
              :table.sync="table"
              :editOfficer="editOfficer"
              :enableOfficer="enableOfficer"
              :resetPassword="resetPassword"
              :deleteOfficer="deleteOfficer"
            />
          </v-card>
        </v-col>
      </v-row>
      <edit-election-officer-dialog
        v-if="selectedOfficerId"
        :show.sync="dialogs.update"
        :officerId="selectedOfficerId"
        :electionId="electionId"
        :refresh="fetchItems"
      />

      <add-election-officer-dialog
        :electionId="electionId"
        :show.sync="dialogs.create"
        :refresh="fetchItems"
      />
    </v-container>
  </span>
</template>

<script lang="ts">
import PageBars from "~/components/bars/PageBars.vue";
import AddElectionOfficerDialog from "@/components/pages/org/dialogs/AddElectionOfficerDialog.vue";
import EditElectionOfficerDialog from "@/components/pages/org/dialogs/EditElectionOfficerDialog.vue";
import ElectionOfficerTable from "@/components/pages/org/tables/ElectionOfficerTable.vue";
import pageRoles from "@/configs/page-roles";
import authMixin from "@/mixins/auth.mixins";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import electionOfficerServices from "@/services/election-officer.service";
import userServices, { User } from "@/services/user.service";
import mixins from "vue-typed-mixins";
import PageCenter from "@/components/utils/PageCenter.vue";
import debounce from "@/helpers/debounce";
const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(manageElectionMixins, authMixin).extend({
  middleware: ["roles"],
  meta: {
    rolesAllowed: pageRoles.election.election_officer,
  },

  props: {
    dialog: {
      type: Boolean,
    },
  },
  components: {
    ElectionOfficerTable,
    AddElectionOfficerDialog,
    EditElectionOfficerDialog,
    PageCenter,
    PageBars,
  },

  data() {
    return {
      form: {
        verify: "",
      },
      verified: false,
      valid: false,
      alert: Object.assign({}, defaultAlert),
      loading: false,
      photoData: null,
      dialogs: {
        create: false,
        update: true,
      },
      selectedOfficerId: null as number | null,
      table: {
        loading: false,
        headers: [
          {
            text: "Firstname",
            value: "firstname",
          },
          {
            text: "Lastname",
            value: "lastname",
          },
          {
            text: "Username",
            value: "username",
          },
          {
            text: "Email Address",
            value: "email_address",
          },
          {
            text: "Disabled",
            value: "disabled",
          },
          {
            text: "Actions",
            value: "actions",
            align: "right",
            sortable: false,
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
    };
  },
  async fetch() {
    await this.fetchItems();
  },

  watch: {
    ["table.search"]: debounce(async function () {
      // @ts-ignore
      await this.fetchItems();
    }, 500),
  },

  methods: {
    async submit() {},

    reset() {
      (this.$refs as any).form.reset();
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },

    async fetchItems() {
      this.loading = true;

      if (!this.electionId) return;

      try {
        const result = await electionOfficerServices.getAll({
          page: this.table.pagination.page,
          take: this.table.pagination.perPage,
          search: this.table.search,
          election_id: this.electionId,
        });

        this.table.items = result.items;
        this.table.pagination.total = result.totalCount;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async editOfficer(user: User) {
      this.selectedOfficerId = user.id;
      this.dialogs.update = true;
    },

    async enableOfficer(user: User) {
      const disableText = user.disabled ? "Enable" : "Disable";

      this.$accessor.system.showAppDialog({
        show: true,
        title: disableText + " Officer Account",
        message: `Are you sure to ${disableText} this account?`,
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            this.loading = true;
            try {
              const result = await userServices.disableUser({
                id: user.id,
                disabled: !user.disabled,
              });
              this.$accessor.snackbar.set({
                show: true,
                message: `Officer Account Succesfully ${disableText}d`,
                timeout: 5000,
                color: "success",
              });

              this.fetchItems();
            } catch (error: any) {
              const message =
                error.response?.data?.error?.message || error.message;

              if (message) {
                this.alert = {
                  show: true,
                  type: "error",
                  message: message,
                };
              }
            } finally {
              hideDialog();
              this.loading = false;
            }
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },

    async resetPassword(user: User) {
      this.$accessor.system.showAppDialog({
        show: true,
        title: "Reset Password",
        message: "Are you sure to reset the account password?",
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            this.loading = true;
            try {
              const result = await userServices.resetPassword(user.id);
              this.$accessor.snackbar.set({
                show: true,
                message: "Password Reset Succesfully",
                timeout: 5000,
                color: "success",
              });
              this.fetchItems();
            } catch (error: any) {
              const message =
                error.response?.data?.error?.message || error.message;

              if (message) {
                this.alert = {
                  show: true,
                  type: "error",
                  message: message,
                };
              }
            } finally {
              hideDialog();
              this.loading = false;
            }
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },

    async deleteOfficer(user: User) {
      this.$accessor.system.showAppDialog({
        show: true,
        title: "Remove Officer Account ",
        message: "Are you sure to remove this account?",
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            hideDialog();
            this.systemAuthentication(
              {
                button: {
                  yesFunction: async () => {
                    try {
                      const result = await userServices.delete(user.id);
                      this.$accessor.snackbar.set({
                        show: true,
                        message: "Officer succesfully removed",
                        timeout: 5000,
                        color: "success",
                      });
                      this.fetchItems();
                    } catch (error: any) {
                      const message =
                        error.response?.data?.error?.message || error.message;

                      if (message) {
                        this.alert = {
                          show: true,
                          type: "error",
                          message: message,
                        };
                      }
                    } finally {
                      hideDialog();
                      this.loading = false;
                    }
                  },
                },
              },
              "current",
              pageRoles.dialogs.deleleElectionOfficer
            );
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },
  },
});
</script>

<style>
</style>