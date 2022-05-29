<template>
  <v-dialog v-model="dialog" width="600">
    <v-card outlined>
      <v-card-title> Delete Organization </v-card-title>
      <v-card-text>
        <v-row class="no-gutters">
          <v-col v-if="alert.show" cols="12">
            <v-alert v-model="alert.show" dismissible :type="alert.type">
              {{ alert.message }}
            </v-alert>
          </v-col>
          <v-col cols="12">
            <p class="body-1">Type the organization title to continue.</p>

            <v-text-field
              outlined
              v-model="form.verify"
              hide-details="auto"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          class="mr-auto"
          large
          @click="$emit('update:dialog', false)"
        >
          Cancel
        </v-btn>
        <v-btn
          @click="submit"
          :loading="loading"
          :disabled="!verified"
          large
          color="error"
          >Delete Organization</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import configs from "@/configs";
import pageRoles from "@/configs/page-roles";
import pageConfig from "@/configs/pages.config";
import authMixin from "@/mixins/auth.mixins";
import manageOrganizationMixin from "@/mixins/manage-organization.mixins";
import organizationServices, {
  Organization,
} from "@/services/organization.service";
import { PropOptions } from "vue";
import mixins from "vue-typed-mixins";

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(manageOrganizationMixin, authMixin).extend({
  props: {
    organization: {
      type: Object,
    } as PropOptions<Organization>,
    dialog: {
      type: Boolean,
    },
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

      baseURL: configs.baseURL,
    };
  },
  watch: {
    "form.verify": {
      handler(value) {
        this.verified = value === this.organization.title;
      },
    },
  },

  methods: {
    async submit() {
      this.$accessor.system.showAppDialog({
        show: true,
        title: "Delete Organization",
        message: "Are you sure to delete this organization?",
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            hideDialog();

            this.systemAuthentication(
              {
                button: {
                  yesFunction: async () => {
                    if (this.organization.id) {
                      this.loading = true;
                      try {
                        await organizationServices.delete(this.organization.id);

                        this.$router.push(pageConfig.dashboard().this().route);

                        this.$accessor.snackbar.set({
                          show: true,
                          message: `Organization ${this.organization.title} deleted`,
                          timeout: 5000,
                          color: "success",
                        });
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
                },
              },
              "current-only-password",
              pageRoles.dialogs.deleteOrganization
            );
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },

    reset() {
      (this.$refs as any).form.reset();
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },
  },
});
</script>