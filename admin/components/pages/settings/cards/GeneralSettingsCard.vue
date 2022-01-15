<template>
  <v-card>
    <v-card-title> General Settings </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-row no-gutters>
          <v-col v-if="alert.show" cols="12">
            <v-alert :type="alert.type">
              {{ alert.message }}
            </v-alert>
          </v-col>

          <v-col class="mb-5" cols="12">
            <logo-uploader :size="130" v-model="photoData" :url="logoUrl" />
          </v-col>

          <v-col cols="12" class="mb-3">
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
          <v-col cols="12" class="mb-3">
            <v-text-field
              label="Title *"
              outlined
              v-model="form.title"
              :rules="rules.title"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" class="mb-3">
            <v-textarea
              label="Description"
              outlined
              v-model="form.description"
              hide-details="auto"
            ></v-textarea>
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
import ThemePicker from "@/components/pickers/ThemePicker.vue";
import LogoUploader from "@/components/utils/LogoUploader.vue";
import configs from "@/configs";
import { Election } from "@/services/election.service";

const defaultForm = {
  slug: "",
  title: "",
  description: "",
  logo: null,
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default Vue.extend({
  components: { LogoUploader },

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
      return "https://res.cloudinary.com/topzdev/image/upload/v1640079580/tup_voting_dev/election_photos/yeiocjtv1krayub4knyj.png";
      // return this.defaultData.logo.url;
    },
    rules: function (): any {
      return {
        slug: [
          (v: any) => !!v || "Slug is required",
          (v: any) =>
            /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/.test(v) || "Slug must be valid",
        ],
        title: [(v: any) => !!v || "Title is required"],
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