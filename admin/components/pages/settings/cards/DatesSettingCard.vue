<template>
  <v-card>
    <v-card-title> Election Dates </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-row>
          <v-col v-if="alert.show" cols="12">
            <v-alert :type="alert.type">
              {{ alert.message }}
            </v-alert>
          </v-col>

          <v-col cols="6">
            <date-time-picker
              label="Start Date *"
              v-model="form.start_date"
              :rules="rules.start_date"
            />
          </v-col>

          <v-col cols="6">
            <date-time-picker
              label="Close Date *"
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

const defaultForm = {
  start_date: "2022-01-14 04:25",
  close_date: "2022-01-14 04:25",
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default Vue.extend({
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
      this.loading = true;

      (this.$refs.form as any).validate();

      if (this.valid) {
        try {
        } catch (error: any) {
          if (error) {
            this.alert = {
              show: true,
              type: "error",
              message: error.message,
            };
          }
        }
      }
      this.loading = false;
    },

    reset() {
      (this.$refs as any).form.reset();
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },
  },
});
</script>