<template>
  <v-form disabled ref="form" v-model="valid">
    <v-card outlined>
      <v-card-title> Archive Election </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col v-if="alert.show" cols="12">
            <v-alert :type="alert.type">
              {{ alert.message }}
            </v-alert>
          </v-col>
          <v-col>
            <p class="body-1 mb-0">
              Archiving the election will hide it from your organization's
              landing page
            </p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="warning"
          :disabled="loading || disabled.overall"
          :loading="loading"
          large
          @click="submit"
          >Archive Election</v-btn
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

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(manageElectionMixins).extend({
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
    disabled(): any {
      if (!this.electionStatus) return;
      return {
        overall: !statusOnlyAllowed(this.electionStatus, ["completed"]),
      };
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
            if (this.valid && this.electionId) {
              this.loading = true;
              try {
                await settingsServices.archive(this.electionId);

                this.$accessor.snackbar.set({
                  show: true,
                  message: "Election Archived Successfully",
                  timeout: 5000,
                  color: "success",
                });

                await this.$accessor.manageElection.fetchElection(
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

    reset() {
      (this.$refs as any).form.reset();
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },
  },
});
</script>