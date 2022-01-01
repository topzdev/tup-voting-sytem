<template>
  <v-form ref="form" v-model="valid">
    <v-row>
      <v-col v-if="alert.show" cols="12">
        <v-alert :type="alert.type">
          {{ alert.message }}
        </v-alert>
      </v-col>

      <v-col align="center" cols="12">
        <logo-uploader v-model="form.logo" />
      </v-col>

      <v-col cols="12">
        <v-text-field
          label="Slug *"
          outlined
          placeholder="ex. tup-org-2021-2022"
          :prefix="baseURL"
          v-model="form.slug"
          :rules="rules.slug"
          hide-details="auto"
        ></v-text-field>
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
          :disabled="loading"
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
import DateTimePicker from "../../pickers/DateTimePicker.vue";
import LogoUploader from "@/components/utils/LogoUploader.vue";
import configs from "@/configs";
import organizationApi from "../../../services/organization.service";
const defaultForm = {
  slug: "",
  title: "",
  description: "",
  start_date: "2022-01-14 04:25",
  close_date: "2022-01-14 04:25",
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
    rules() {
      return {
        slug: [
          (v: any) => !!v || "Slug is required",
          (v: any) =>
            /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/.test(v) || "Slug must be valid",
        ],
        title: [(v: any) => !!v || "Title is required"],
        start_date: [(v: any) => !!v || "Start Date is required"],
        close_date: [(v: any) => !!v || "Close Date is required"],
      };
    },
  },

  methods: {
    async submit() {
      if (!this.form.logo) {
        this.alert = {
          show: true,
          type: "error",
          message: "Logo is required",
        };

        return;
      }
      this.loading = true;

      (this.$refs as any).form.validate();

      if (this.valid) {
        console.log(this.form);
        try {
          await this.createFunc(this.form);
          this.reset();
        } catch (error: any) {
          this.alert = {
            show: true,
            type: "error",
            message: error.message,
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
