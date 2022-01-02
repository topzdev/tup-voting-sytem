<template>
  <v-form ref="form" v-model="valid">
    <v-row>
      <v-col v-if="alert.show" cols="12">
        <v-alert :type="alert.type">
          {{ alert.message }}
        </v-alert>
      </v-col>

      <v-col align="center" cols="12">
        <logo-uploader v-model="photoData" :url="form.logo.url" />
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
import Vue, { PropOptions } from "vue";
import ThemePicker from "@/components/pickers/ThemePicker.vue";
import LogoUploader from "@/components/utils/LogoUploader.vue";
import configs from "@/configs";

const defaultForm = {
  slug: "",
  title: "",
  description: "",
  ticker: "",
  themePrimary: "blue",
  themeSecondary: "red",
  logo: null,
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default Vue.extend({
  components: { ThemePicker, LogoUploader },
  props: {
    defaultData: Object,
    updateFunc: Function,
  },
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
    defaultLogoUrl(): string {
      const url = this.defaultData.logo.public_url || this.form.logo;
      return url;
    },
    rules: function (): object {
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
      if (!this.form.logo) {
        this.alert = {
          show: true,
          type: "error",
          message: "Logo is required",
        };

        return;
      }
      this.loading = true;

      (this.$refs.form as any).validate();

      if (this.valid) {
        try {
          await this.updateFunc({
            ...this.form,
            logo: this.photoData,
            id: this.defaultData.id,
          });
          this.reset();
        } catch (error: any) {
          console.log(error);
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

  watch: {
    defaultData: {
      deep: true,
      immediate: true,
      handler: function (value, oldVal) {
        const theme = value.theme;

        delete value.theme;

        this.form = Object.assign(
          {},
          {
            ...value,
            themePrimary: theme.primary,
            themeSecondary: theme.secondary,
          }
        );
      },
    },
  },
});
</script>

