<template>
  <v-form ref="form" v-model="valid">
    <v-card outlined>
      <v-card-title> Remove Organization </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
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
          <v-col cols="8">
            <p class="body-1">Type current organization title to continue.</p>

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
          @click="submit"
          :loading="loading"
          :disabled="!verified"
          large
          color="error"
          >Remove Organization</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import pageConfig from "@/configs/pages.config";
import authMixin from "@/mixins/auth.mixins";
import manageOrganizationMixin from "@/mixins/manage-organization.mixins";
import organizationServices, {
  Organization,
} from "@/services/organization.service";
import mixins from "vue-typed-mixins";
import pageRoles from "../../../../configs/page-roles";

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
    };
  },
  watch: {
    "form.verify": {
      handler(value) {
        if (!this.organization) return false;
        this.verified = value === this.organization.title;
      },
    },
  },

  methods: {
    async submit() {
      this.$accessor.system.showAppDialog({
        show: true,
        title: "Remove Organization",
        message: "Are you sure to remove this organization?",
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            hideDialog();

            this.systemAuthentication(
              {
                button: {
                  yesFunction: async () => {
                    if (this.organization && this.organization.id) {
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