<template>
  <v-card outlined>
    <v-card-title> Election Dates </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-row>
          <v-col v-if="alert.show" cols="12">
            <v-alert v-if="alert.show" :type="alert.type" dismissible>
              {{ alert.message }}
            </v-alert>
          </v-col>

          <v-col cols="6">
            <date-time-picker
              :disabled="startDateDisable"
              label="Start DateTime *"
              v-model="form.start_date"
              :rules="rules.start_date"
            />
          </v-col>

          <v-col cols="6">
            <date-time-picker
              :disabled="closeDateDisable"
              label="Close DateTime *"
              v-model="form.close_date"
              :rules="rules.close_date"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="primary"
        :disabled="!valid || loading || overallDisable"
        :loading="loading"
        large
        @click="submit"
        >Save</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import DateTimePicker from "@/components/pickers/DateTimePicker.vue";
import configs from "@/configs";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import settingsService from "@/services/settings.service";
import { Election } from "@/services/election.service";
import { statusOnlyAllowed } from "@/helpers/isAllowedByStatus.helper";
import globalRules from "@/configs/global-rules.config";
const defaultForm = {
  start_date: "",
  close_date: "",
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(manageElectionMixins).extend({
  components: { DateTimePicker },

  data() {
    return {
      valid: false,
      alert: Object.assign({}, defaultAlert),
      loading: false,
      form: Object.assign({}, defaultForm),
      photoData: null,
      loaded: false,
      baseURL: configs.baseURL,
    };
  },

  computed: {
    startDateDisable(): boolean {
      if (!this.electionInfo) return true;
      return this.electionInfo.final_status !== "building";
    },

    closeDateDisable(): boolean {
      if (!this.electionStatus) return true;

      return !statusOnlyAllowed(this.electionStatus, ["running", "building"]);
    },

    overallDisable(): boolean {
      if (!this.electionStatus) return true;
      return !statusOnlyAllowed(this.electionStatus, ["running", "building"]);
    },

    rules: function (): any {
      return {
        start_date: this.overallDisable
          ? []
          : globalRules.start_date(this.form.close_date),
        close_date: this.overallDisable ? [] : globalRules.close_date,
      };
    },
  },

  methods: {
    async submit() {
      (this.$refs.form as any).validate();

      if (this.valid && this.electionId) {
        this.loading = true;
        try {
          await settingsService.updateDates(this.electionId, this.form);

          this.$accessor.snackbar.set({
            show: true,
            message: "Election Dates Updated",
            timeout: 5000,
            color: "success",
          });

          await this.$accessor.manageElection.fetchElection(this.electionId);
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

  watch: {
    ["form"]: {
      deep: true,
      handler: function () {
        (this.$refs.form as any).validate();
      },
    },

    electionInfo: {
      immediate: true,
      handler: function (value: Election) {
        console.log(value);
        this.form = {
          start_date: value.start_date,
          close_date: value.close_date,
        };
      },
    },
  },
});
</script>