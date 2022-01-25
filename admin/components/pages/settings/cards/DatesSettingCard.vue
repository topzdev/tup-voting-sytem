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
              label="Start DateTime *"
              v-model="form.start_date"
              :rules="rules.start_date"
            />
          </v-col>

          <v-col cols="6">
            <date-time-picker
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
        :disabled="loading"
        :loading="loading"
        large
        @click="submit"
        >Submit</v-btn
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

      baseURL: configs.baseURL,
    };
  },

  computed: {
    rules: function (): any {
      return {
        start_date: [(v: any) => !!v || "Start Date is required"],
        close_date: [(v: any) => !!v || "Close Date is required"],
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
    electionInfo: {
      immediate: true,
      handler: function (value: Election) {
        console.log(value);

        this.form = {
          start_date: value.start_date,
          close_date: value.start_date,
        };
      },
    },
  },
});
</script>