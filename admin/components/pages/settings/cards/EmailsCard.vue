<template>
  <v-card outlined>
    <v-card-title> Election Emails </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-row class="no-gutters">
          <v-col v-if="alert.show" cols="12">
            <v-alert v-model="alert.show" :type="alert.type" dismissible>
              {{ alert.message }}
            </v-alert>
          </v-col>
          <v-col class="email-section" cols="12" v-if="show.credentials">
            <h3 class="mb-2 text--primary">Credentials of voters email</h3>
            <p>
              Send credentials thru emails to all voters or specific voters.
            </p>
            <div class="d-flex align-center">
              <v-btn color="primary" large @click="submitCrendentialsToAll"
                >Send Credentials to All Voters</v-btn
              >
              <p class="mb-0 mx-3">or</p>

              <v-form
                ref="singleVoterCredentials"
                v-model="credentials.single.valid"
                style="width: 100%"
              >
                <div class="d-flex">
                  <voter-picker
                    :rules="credentials.single.rules"
                    color="secondary"
                    v-model="credentials.single.voters_ids"
                    style="width: 100%"
                  />
                  <v-btn
                    outlined
                    large
                    class="ml-2"
                    color="secondary"
                    @click="submitCredentialToSpecifics"
                    >Send
                  </v-btn>
                </div>
              </v-form>
            </div>
          </v-col>

          <v-col
            class="email-section"
            cols="12"
            v-if="show.electionHasLaunched"
          >
            <h3 class="mb-2 text--primary">Election has launched email</h3>
            <p>Send "Election has launched" to all voters.</p>
            <v-btn color="primary" large @click="sendElectionHasLaunchedToAll"
              >Send Election has launched to all Voters</v-btn
            >
          </v-col>

          <v-col class="email-section" cols="12" v-if="show.electionHasEnded">
            <h3 class="mb-2 text--primary">Election has ended email</h3>
            <p>Send "Election has ended" to all voters.</p>
            <v-btn color="primary" large @click="sendElectionHasEndedToAll"
              >Send Election has ended to all Voters</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
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
import VoterPicker from "@/components/pickers/VoterPicker.vue";
import restrictionsMixin from "@/mixins/restrictions.mixin";
import pageStatus from "@/configs/page-status.config";

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(settingsMixin, restrictionsMixin).extend({
  components: {
    VoterPicker,
  },
  data() {
    return {
      valid: false,
      alert: Object.assign({}, defaultAlert),
      loading: false,
      photoData: null,

      credentials: {
        bulkLoading: false,

        single: {
          loading: false,
          valid: true,
          rules: [(v: any) => !!v.length || "Select voters to proceed"],
          voters_ids: [],
        },
      },

      baseURL: configs.baseURL,
    };
  },

  computed: {
    show() {
      return {
        credentials: this.hideByStatus(pageStatus.settings.emails.credentials),

        electionHasLaunched: this.hideByStatus(
          pageStatus.settings.emails.electionHasLaunched
        ),
        electionHasEnded: this.hideByStatus(
          pageStatus.settings.emails.electionHasEnded
        ),
      };
    },
  },

  methods: {
    async submitCredentialToSpecifics() {
      (this.$refs.singleVoterCredentials as any).validate();

      const voters = this.credentials.single.voters_ids;
      console.log(voters);

      if (!this.credentials.single.valid) return;

      this.$accessor.system.showAppDialog({
        show: true,
        title: "Send Credential to Specific Voters",
        message: "Are you sure to send credentials to selected voters?",
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            if (this.valid && this.electionId) {
              this.credentials.bulkLoading = true;
              try {
                await settingsServices.sendCredentialsEmail(
                  this.electionId,
                  voters
                );
                this.$accessor.snackbar.set({
                  show: true,
                  message: "Voters Credentials Sent",
                  color: "success",
                  timeout: 2000,
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
                this.credentials.bulkLoading = false;
              }
            }
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },

    async submitCrendentialsToAll() {
      (this.$refs.form as any).validate();

      this.$accessor.system.showAppDialog({
        show: true,
        title: "Send Credentials to All email",
        message: "Are you sure to send credentials to all voters?",
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            if (this.valid && this.electionId) {
              this.credentials.bulkLoading = true;
              try {
                await settingsServices.sendCredentialsEmail(
                  this.electionId,
                  "all"
                );
                this.$accessor.snackbar.set({
                  show: true,
                  message: "Voters Credentials Sent",
                  color: "success",
                  timeout: 2000,
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
                this.credentials.bulkLoading = false;
              }
            }
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },

    async sendElectionHasLaunchedToAll() {
      (this.$refs.form as any).validate();

      this.$accessor.system.showAppDialog({
        show: true,
        title: "Send Election has launched",
        message: 'Are you sure to send "Election has launched" to all voters?',
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            if (this.valid && this.electionId) {
              this.credentials.bulkLoading = true;
              try {
                await settingsServices.sendElectionHasLaunched(this.electionId);
                this.$accessor.snackbar.set({
                  show: true,
                  message: '"Election has launched" Email Sent',
                  color: "success",
                  timeout: 2000,
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
                this.credentials.bulkLoading = false;
              }
            }
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },
    async sendElectionHasEndedToAll() {
      (this.$refs.form as any).validate();

      this.$accessor.system.showAppDialog({
        show: true,
        title: "Send Election has ended email",
        message: 'Are you sure to send "Election has ended" to all voters?',
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            if (this.valid && this.electionId) {
              this.credentials.bulkLoading = true;
              try {
                await settingsServices.sendElectionHasEnded(this.electionId);
                this.$accessor.snackbar.set({
                  show: true,
                  message: '"Election has ended" Email Sent',
                  color: "success",
                  timeout: 2000,
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
                this.credentials.bulkLoading = false;
              }
            }
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


<style lang="scss" scoped>
.email-section {
  &:not(:last-child) {
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }
}
</style>