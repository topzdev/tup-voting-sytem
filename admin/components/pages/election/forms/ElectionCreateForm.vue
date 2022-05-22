<template>
  <v-form ref="form" v-model="valid">
    <v-row>
      <v-col v-if="alert.show" cols="12">
        <v-alert :type="alert.type" dismissible>
          {{ alert.message }}
        </v-alert>
      </v-col>

      <v-col align="center" cols="12">
        <logo-uploader v-model="form.logo" />
      </v-col>

      <v-col cols="12">
        <v-text-field
          label="Title *"
          outlined
          v-model="form.title"
          :rules="rules.title"
          hide-details="auto"
        ></v-text-field>
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

      <v-col cols="12">
        <v-textarea
          label="Description"
          outlined
          v-model="form.description"
          hide-details="auto"
        ></v-textarea>
      </v-col>

      <v-col class="d-flex" cols="12">
        <v-btn
          color="primary"
          :disabled="!valid || loading"
          :loading="loading"
          large
          block
          @click="submit"
          >Submit</v-btn
        >
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import DateTimePicker from "@/components/pickers/DateTimePicker.vue";
import LogoUploader from "@/components/utils/LogoUploader.vue";
import configs from "@/configs";
import organizationApi from "@/services/organization.service";
import globalRules from "@/configs/global-rules.config";

const getNextDay = (day: number) => {
  var today = new Date();
  var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000 * day);
  return tomorrow;
};

const defaultForm = {
  title: "",
  description: "",
  start_date: getNextDay(1),
  close_date: getNextDay(2),
  logo: null,
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default Vue.extend({
  props: {
    createFunc: Function,
  },
  components: { DateTimePicker, LogoUploader },
  data() {
    return {
      valid: false,
      alert: Object.assign({}, defaultAlert),

      loading: false,
      form: Object.assign({}, defaultForm),

      baseURL: configs.baseURL,
    };
  },

  computed: {
    rules(): any {
      return {
        slug: globalRules.slug,
        title: [(v: any) => !!v || "Title is required"],
        start_date: globalRules.start_date(this.form.close_date),
        close_date: globalRules.close_date(this.form.start_date),
      };
    },
  },

  methods: {
    async submit() {
      if (!this.form.logo) {
        return (this.alert = {
          show: true,
          type: "error",
          message: "Logo is required",
        });
      }

      this.loading = true;

      (this.$refs as any).form.validate();

      if (this.valid) {
        console.log(this.form);
        try {
          await this.createFunc(this.form);
          this.reset();
        } catch (error: any) {
          const message = error.response?.data?.error?.message || error.message;
          this.alert = {
            show: true,
            type: "error",
            message: message,
          };
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
