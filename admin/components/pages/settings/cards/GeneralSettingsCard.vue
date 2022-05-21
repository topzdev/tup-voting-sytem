<template>
  <v-form :disabled="disabled.overall" ref="form" v-model="valid">
    <v-card outlined>
      <v-card-title> General Settings </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row no-gutters>
          <v-col v-if="alert.show" cols="12">
            <v-alert v-model="alert.show" :type="alert.type" dismissible>
              {{ alert.message }}
            </v-alert>
          </v-col>

          <v-col class="mb-5 d-flex flex-column align-start" cols="12">
            <label for="">Logo</label>
            <logo-uploader
              :disabled="disabled.overall"
              size="130"
              v-model="form.logo"
              :url="logoUrl"
              :withBtn="true"
            />
          </v-col>
          <!-- 
          <v-col cols="12" class="mb-3">
            <v-text-field
              label="Slug *"
              outlined
              placeholder="ex. tup-org-2021-2022"
              :prefix="baseURL"
              v-model="form.slug"
              :rules="rules.slug"
              :disabled="disabled.slug"
              hide-details="auto"
            ></v-text-field>
          </v-col> -->

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
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          :disabled="!valid || loading || disabled.overall"
          :loading="loading"
          large
          @click="submit"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import LogoUploader from "@/components/utils/LogoUploader.vue";
import configs from "@/configs";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import settingsService from "@/services/settings.service";
import { Election } from "@/services/election.service";
import globalRules from "@/configs/global-rules.config";
import { statusOnlyAllowed } from "../../../../helpers/isAllowedByStatus.helper";

const defaultForm = {
  title: "",
  description: "",
  logo: null,
  slug: "",
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(manageElectionMixins).extend({
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
    disabled(): any {
      if (!this.electionStatus) return;
      return {
        overall: !statusOnlyAllowed(this.electionStatus, [
          "building",
          "running",
        ]),
        slug: !statusOnlyAllowed(this.electionStatus, ["building"]),
      };
    },

    logoUrl(): string | null {
      const logo = this.electionInfo?.logo;

      if (!logo) return null;

      return logo.url;
      // return this.defaultData.logo.url;
    },
    rules(): any {
      return {
        slug: globalRules.slug,
        title: [(v: any) => !!v || "Title is required"],
      };
    },
  },

  methods: {
    async submit(): Promise<void> {
      (this.$refs.form as any).validate();

      if (this.valid && this.electionId) {
        this.loading = true;
        try {
          await settingsService.updateGeneral(this.electionId, this.form);

          this.$accessor.snackbar.set({
            show: true,
            message: "Settings Updated",
            timeout: 5000,
            color: "success",
          });

          await this.$accessor.manageElection.reFetchElection(this.electionId);
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

    reset(): void {
      (this.$refs as any).form.reset();
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },
  },

  watch: {
    electionInfo: {
      immediate: true,
      handler: function (value: Election) {
        this.form = {
          slug: value.slug,
          title: value.title,
          description: value.description,
          logo: null,
        };
      },
    },
  },
});
</script>