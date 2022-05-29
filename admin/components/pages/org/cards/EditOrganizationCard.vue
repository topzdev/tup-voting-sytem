<template>
  <v-form ref="form" v-model="valid">
    <v-card :loading="pageLoading" outlined>
      <v-card-title> Organization Information </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col v-if="alert.show" cols="12">
            <v-alert :type="alert.type" dismissible>
              {{ alert.message }}
            </v-alert>
          </v-col>

          <v-col cols="12">
            <logo-uploader
              v-if="form.logo"
              v-model="photoData"
              :url="form.logo.url"
              withBtn
            />
          </v-col>

          <v-col cols="8">
            <v-text-field
              label="Title *"
              outlined
              v-model="form.title"
              :rules="rules.title"
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
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
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          :disabled="!valid || loading"
          :loading="loading"
          large
          @click="submit"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import ThemePicker from "@/components/pickers/ThemePicker.vue";
import LogoUploader from "@/components/utils/LogoUploader.vue";
import configs from "@/configs";
import organizationServices from "@/services/organization.service";
import mixins from "vue-typed-mixins";
import orgMixin from "@/mixins/org.mixins";
import manageOrganizationMixin from "@/mixins/manage-organization.mixins";

const defaultForm = {
  slug: "",
  title: "",
  description: "",
  ticker: "",
  themePrimary: "blue",
  themeSecondary: "red",
  logo: null as any,
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(manageOrganizationMixin).extend({
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
      pageLoading: false,

      baseURL: configs.baseURL,
    };
  },
  computed: {
    defaultLogoUrl(): string {
      const url = this.defaultData.logo.public_url || this.form.logo;
      return url;
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
    async update(data) {
      try {
        const result = await organizationServices.update(data);
        console.log(result);
        this.$accessor.snackbar.set({
          show: true,
          message: "Organization Updated!",
          timeout: 5000,
          color: "success",
        });
        this.$accessor.organization.refreshOrganization();
      } catch (error: any) {
        throw error.response.data.error;
      }
    },
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
          await this.update({
            ...this.form,
            logo: this.photoData,
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
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },
  },
  watch: {
    organization: {
      deep: true,
      immediate: true,
      handler: function (value, oldVal) {
        const theme = value.theme;

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