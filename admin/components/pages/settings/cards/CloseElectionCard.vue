<template>
  <v-card outlined>
    <v-card-title> Close Election </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-row>
          <v-col v-if="alert.show" cols="12">
            <v-alert v-model="alert.show" :type="alert.type" dismissible>
              {{ alert.message }}
            </v-alert>
          </v-col>
          <v-col cols="12">
            <p class="body-1 mb-0">
              Are you sure to close this election? It will automatically
              complete the election and the voters can't vote.
            </p>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="error"
        :disabled="loading"
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
import settingsServices from "../../../../services/settings.service";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "../../../../mixins/manage-election.mixins";

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

  methods: {
    async submit() {
      (this.$refs.form as any).validate();

      if (this.valid && this.electionId) {
        this.loading = true;
        try {
          await settingsServices.archive(this.electionId);
        } catch (error: any) {
          const message = error.response?.data?.error?.message || error.message;

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

    reset() {
      (this.$refs as any).form.reset();
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },
  },
});
</script>