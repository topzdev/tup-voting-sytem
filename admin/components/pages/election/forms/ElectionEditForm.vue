<template>
  <v-form ref="form" v-model="valid">
    <v-row>
      <v-col v-if="alert.show" cols="12">
        <v-alert :type="alert.type" dismissible>
          {{ alert.message }}
        </v-alert>
      </v-col>

      <v-col align="center" cols="12">
        <logo-uploader v-model="photoData" :url="logoUrl" />
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
        <v-btn text to="/" large class="mr-auto">Cancel</v-btn>
        <v-btn
          color="primary"
          :disabled="!valid || loading"
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
import Vue, { PropOptions } from "vue";
import ThemePicker from "@/components/pickers/ThemePicker.vue";
import LogoUploader from "@/components/utils/LogoUploader.vue";
import configs from "@/configs";
import { Election } from "../../../../services/election.service";

const defaultForm = {
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
    defaultData: { type: Object } as PropOptions<Election>,
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
    logoUrl(): string {
      return this.defaultData.logo.url;
    },
    rules: function (): any {
      return {
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

      if (!this.form.logo) {
        return (this.alert = {
          show: true,
          type: "error",
          message: "Logo is required",
        });
      }

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
          const message = error.response?.data?.error?.message || error.message;
          if (error) {
            this.alert = {
              show: true,
              type: "error",
              message,
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

