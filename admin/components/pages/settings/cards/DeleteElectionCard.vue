<template>
  <v-form ref="form" v-model="valid">
    <v-card outlined>
      <v-card-title> Delete Election </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row class="no-gutters">
          <v-col v-if="alert.show" cols="12">
            <v-alert v-model="alert.show" dismissible :type="alert.type">
              {{ alert.message }}
            </v-alert>
          </v-col>
          <v-col cols="8">
            <p class="body-1">
              Type election title to continue deleting this election.
            </p>

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
          >Delete Election</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import configs from "@/configs";
import settingsServices from "@/services/settings.service";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import { statusOnlyAllowed } from "@/helpers/isAllowedByStatus.helper";
import settingsMixin from "@/mixins/settings.mixin";

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(settingsMixin).extend({
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
        this.verified = value === this.electionInfo?.title;
      },
    },
  },

  methods: {
    async submit() {
      (this.$refs.form as any).validate();

      this.$accessor.system.showAppDialog({
        show: true,
        title: "Delete Election",
        message: "Are you sure to delete this election?",
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            hideDialog();
            this.$accessor.system.showAuthenticationDialog({
              button: {
                yesFunction: async () => {
                  if (this.valid && this.electionId) {
                    this.loading = true;
                    try {
                      await this.$accessor.manageElection.deleteElection();

                      this.$accessor.snackbar.set({
                        show: true,
                        message: `Election ${this.electionInfo?.title} deleted`,
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
              type: "default",
              message:
                "The election officer must authenticate first before approving this action.",
              allowedRole: "super-admin",
              show: true,
            });
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