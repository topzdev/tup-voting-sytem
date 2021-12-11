<template>
  <v-form ref="form" v-model="valid">
    <v-row>
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
      <v-col cols="12">
        <v-text-field
          label="Ticker *"
          outlined
          v-model="form.ticker"
          :rules="rules.ticker"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-textarea
          label="Description"
          outlined
          v-model="form.description"
          hide-details="auto"
        ></v-textarea>
      </v-col>
      <v-col cols="6">
        <theme-picker
          label="Theme - Primary"
          outlined
          v-model="form.themePrimary"
          :rules="rules.themePrimary"
          hide-details="auto"
        ></theme-picker>
      </v-col>
      <v-col cols="6">
        <theme-picker
          label="Theme - Secondary"
          outlined
          v-model="form.themeSecondary"
          :rules="rules.themeSecondary"
          hide-details="auto"
        ></theme-picker>
      </v-col>

      <v-col class="d-flex" cols="12">
        <v-btn text to="/org" large class="mr-auto">Cancel</v-btn>
        <v-btn
          color="primary"
          :disabled="loading"
          :loading="loading"
          large
          @click="submit"
          >Submit</v-btn
        >
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import ThemePicker from "../../pickers/ThemePicker.vue";
import LogoUploader from "@/components/utils/LogoUploader.vue";
import configs from "@/configs";
import organizationApi from "../../../services/organization.service";
const defaultForm = {
  slug: "",
  title: "",
  description: "",
  ticker: "",
  themePrimary: "blue",
  themeSecondary: "red",
  logo: null,
};

export default Vue.extend({
  props: {
    createFunc: Function,
  },
  components: { ThemePicker, LogoUploader },
  data() {
    return {
      valid: false,
      alert: {
        show: false,
        type: "",
        message: "",
      },

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
        ticker: [(v: any) => !!v || "Ticker is required"],
        themePrimary: [(v: any) => !!v || "Theme Primary is required"],
        themeSecondary: [(v: any) => !!v || "Theme Secondary is required"],
      };
    },
  },

  methods: {
    async submit() {
      this.loading = true;

      (this.$refs as any).form.validate();

      if (this.valid) {
        try {
          await this.createFunc(this.form);
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
  },
});
</script>
=
