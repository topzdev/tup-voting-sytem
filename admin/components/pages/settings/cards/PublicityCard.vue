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
const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(settingsMixin).extend({
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
      },
      baseURL: configs.baseURL,
    };
  },

  computed: {
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

      handler: function (value) {
        console.log("Election Informatio", value);
        this.body.is_public = value.is_public;
        this.body.is_tally_public = value.is_tally_public;
      },
    },
  },
});
</script>