<template>
  <v-form ref="form" v-model="valid">
    <v-card outlined>
      <v-card-title>
        Election Officers

        <v-btn
          color="primary"
          large
          class="ml-auto"
          @click="dialogs.create = true"
          >Add Officer</v-btn
        >
      </v-card-title>
      <v-card-text class="py-0">
        <v-row no-gutters>
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
        </v-row>
      </v-card-text>
      <election-officer-table
        :table.sync="table"
        :editOfficer="editOfficer"
        :enableOfficer="enableOfficer"
        :resetPassword="resetPassword"
        :deleteOfficer="deleteOfficer"
      />
    </v-card>

    <edit-election-officer-dialog
      v-if="selectedOfficerId"
      :show.sync="dialogs.update"
      :officerId="selectedOfficerId"
      :organizationId="organizationId"
      :refresh="fetchItems"
    />

    <add-election-officer-dialog
      :organizationId="organizationId"
      :show.sync="dialogs.create"
      :refresh="fetchItems"
    />
  </v-form>
</template>

<script lang="ts">
import ElectionOfficerTable from "@/components/pages/org/tables/ElectionOfficerTable.vue";
import AddElectionOfficerDialog from "@/components/pages/org/dialogs/AddElectionOfficerDialog.vue";
import EditElectionOfficerDialog from "@/components/pages/org/dialogs/EditElectionOfficerDialog.vue";
import authMixin from "@/mixins/auth.mixins";
import manageOrganizationMixin from "@/mixins/manage-organization.mixins";
import { Organization } from "@/services/organization.service";
import { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import electionOfficerServices from "@/services/election-officer.service";
import userServices from "@/services/user.service";
import { User } from "@/services/user.service";
import pageRoles from "../../../../configs/page-roles";

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(manageOrganizationMixin, authMixin).extend({
  props: {
    dialog: {
      type: Boolean,
    },
  },
  components: {
    ElectionOfficerTable,
    AddElectionOfficerDialog,
    EditElectionOfficerDialog,
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
    };
  },
  async fetch() {
    await this.fetchItems();
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
            if (this.valid) {
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