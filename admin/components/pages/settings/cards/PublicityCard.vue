<template>
  <v-form ref="form" v-model="valid">
    <v-card outlined>
      <v-card-title> Election Publicity </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row class="no-gutters">
          <v-col v-if="alert.show" cols="12">
            <v-alert v-model="alert.show" dismissible :type="alert.type">
              {{ alert.message }}
            </v-alert>
          </v-col>
          <v-col cols="12">
            <label class="body-1 mb-0 text--primary" for="is_public"
              >Show election information to public.

              <publicity-icon
                :size="20"
                v-if="electionInfo"
                :value="electionInfo.is_public"
              />
            </label>
            <v-switch
              class="mt-1"
              id="is_public"
              v-model="body.is_public"
              @change="electionPublicity"
              inset
            ></v-switch>
          </v-col>
          <!-- 
          <v-col cols="12">
            <label class="body-1 mb-0 text--primary" for="is_tally_public"
              >Show to the election final tally to public after election is
              completed.

              <publicity-icon
                :size="20"
                preLabel="Election Final Tally"
                v-if="electionInfo"
                :value="electionInfo.is_tally_public"
              />
            </label>
            <v-switch
              class="mt-0"
              id="is_tally_public"
              v-model="body.is_tally_public"
              @change="electionTallyPublicity"
              inset
            ></v-switch>
          </v-col> -->

          <v-col cols="12" v-if="show.allow_pre_registration">
            <label class="body-1 mb-0 text--primary" for="pre_register"
              >Allow Pre-Registration on preview state of election.
            </label>
            <v-switch
              class="mt-0"
              id="pre_register"
              v-model="body.allow_pre_register"
              @change="allowElectionPreRegistration"
              inset
            ></v-switch>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import configs from "@/configs";
import settingsMixin from "@/mixins/settings.mixin";
import settingsServices from "@/services/settings.service";
import mixins from "vue-typed-mixins";
import PublicityIcon from "~/components/icon/PublicityIcon.vue";
import { Election } from "@/services/election.service";
import restrictionsMixin from "@/mixins/restrictions.mixin";
import pageStatus from "@/configs/page-status.config";
const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(settingsMixin, restrictionsMixin).extend({
  components: {
    PublicityIcon,
  },

  data() {
    return {
      valid: false,
      alert: Object.assign({}, defaultAlert),
      loading: false,
      photoData: null,
      body: {
        is_public: false,
        is_tally_public: false,
        allow_pre_register: false,
      },
      baseURL: configs.baseURL,
    };
  },

  computed: {
    show(): any {
      return {
        allow_pre_registration: this.hideByStatus(
          pageStatus.settings.publicity.preRegistration
        ),
      };
    },
    isPublicIcon(): string {
      if (!this.electionInfo) return "";
      return this.electionInfo.is_public ? "mdi-earth" : "mdi-lock";
    },
    isTallyPublicIcon(): string {
      if (!this.electionInfo) return "";
      return this.electionInfo.is_tally_public ? "mdi-earth" : "mdi-lock";
    },
  },

  methods: {
    async electionPublicity() {
      const is_public = this.body.is_public;

      (this.$refs.form as any).validate();

      this.$accessor.system.showAppDialog({
        show: true,
        title: "Election Publicity",
        message: `Are you sure to set election as ${
          is_public ? "public" : "private"
        }?`,
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            if (this.valid && this.electionId) {
              this.loading = true;
              try {
                await settingsServices.electionPublicity(
                  this.electionId,
                  is_public
                );

                this.$accessor.snackbar.set({
                  show: true,
                  message: "Election Publicity Updated",
                  timeout: 5000,
                  color: "success",
                });

                await this.$accessor.manageElection.reFetchElection(
                  this.electionId
                );
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
            this.body.is_public = !is_public;
          },
        },
      });
    },

    async electionTallyPublicity() {
      const is_tally_public = this.body.is_tally_public;

      (this.$refs.form as any).validate();

      this.$accessor.system.showAppDialog({
        show: true,
        title: "Election Final Tally Publicity",
        message: `Are you sure to set election finall tally as ${
          is_tally_public ? "public" : "private"
        }?`,
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            if (this.valid && this.electionId) {
              this.loading = true;
              try {
                await settingsServices.electionTallyPublicity(
                  this.electionId,
                  is_tally_public
                );

                this.$accessor.snackbar.set({
                  show: true,
                  message: "Election Finall Tally Publicity Updated",
                  timeout: 5000,
                  color: "success",
                });

                await this.$accessor.manageElection.reFetchElection(
                  this.electionId
                );
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
            this.body.is_tally_public = !is_tally_public;
          },
        },
      });
    },

    async allowElectionPreRegistration() {
      const allow_pre_register = this.body.allow_pre_register;

      (this.$refs.form as any).validate();

      this.$accessor.system.showAppDialog({
        show: true,
        title: "Allow Pre-registration in this election?",
        message: `Are you sure to allow pre-registration in this election`,
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            if (this.valid && this.electionId) {
              this.loading = true;
              try {
                await settingsServices.allowElectionPreRegistration(
                  this.electionId,
                  allow_pre_register
                );

                this.$accessor.snackbar.set({
                  show: true,
                  message: "Election Pre-registration Updated",
                  timeout: 5000,
                  color: "success",
                });

                await this.$accessor.manageElection.reFetchElection(
                  this.electionId
                );
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
            this.body.allow_pre_register = !allow_pre_register;
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

  watch: {
    "body.is_public": {
      immediate: false,
      handler: async function (value) {},
    },

    electionInfo: {
      deep: true,
      immediate: true,

      handler: function (value: Election) {
        console.log("Election Informatio", value);
        this.body.is_public = value.is_public;
        this.body.is_tally_public = value.is_tally_public;
        this.body.allow_pre_register = value.allow_pre_register;
      },
    },
  },
});
</script>