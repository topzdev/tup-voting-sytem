<template>
  <v-card outlined>
    <v-card-title> Close Election </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-row class="no-gutters">
          <v-col v-if="alert.show" cols="12">
            <v-alert v-model="alert.show" :type="alert.type" dismissible>
              {{ alert.message }}
            </v-alert>
          </v-col>
          <v-col cols="12">
            <p class="body-1 mb-0">
              Are you sure to close this election? It will automatically
              complete the election and the voters wil not be able to vote.
            </p>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="error"
        :disabled="loading || overallDisable"
        :loading="loading"
        large
        @click="submit"
        >Close Election</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import configs from "@/configs";
import settingsServices from "@/services/settings.service";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import { statusOnlyAllowed } from "@/helpers/isAllowedByStatus.helper";
import settingsMixin from "@/mixins/settings.mixin";
import authMixin from "../../../../mixins/auth.mixins";
import pageRoles from "../../../../configs/page-roles";

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(settingsMixin, authMixin).extend({
  data() {
    return {
      valid: false,
      alert: Object.assign({}, defaultAlert),
      loading: false,
      photoData: null,

      baseURL: configs.baseURL,
    };
  },

  computed: {
    overallDisable() {
      if (!this.electionStatus) return true;
      return !statusOnlyAllowed(this.electionStatus, ["running"]);
    },
  },

  methods: {
    async submit() {
      (this.$refs.form as any).validate();

      this.$accessor.system.showAppDialog({
        show: true,
        title: "Close Election",
        message: "Are you sure to close this election?",
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            hideDialog();
            this.systemAuthentication(
              {
                button: {
                  yesFunction: async () => {
                    if (this.valid && this.electionId) {
                      this.loading = true;
                      try {
                        await settingsServices.closeElection(this.electionId);
                        this.$accessor.snackbar.set({
                          show: true,
                          message: "Election has been closed!",
                          color: "warning",
                          timeout: 2000,
                        });

                        await this.$accessor.manageElection.reFetchElection(
                          this.electionId
                        );

                        this.$router.push(this.generalRoute());
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
              pageRoles.dialogs.closeElection
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