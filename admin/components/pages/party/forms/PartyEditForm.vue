<template>
  <v-form ref="form" v-model="valid">
    <v-row>
      <v-col v-if="alert.show" cols="12" class="pb-0">
        <v-alert
          v-model="alert.show"
          :type="alert.type"
          class="mb-0"
          dismissible
        >
          {{ alert.message }}
        </v-alert>
      </v-col>
      <v-col cols="12" style="position: relative; margin-top: -10px">
        <cover-photo-uploader
          tabindex="-1"
          class="mx-auto"
          v-model="coverPhotoData"
          :url="coverPhotoUrl"
          height="350"
          withBtn
        >
        </cover-photo-uploader>
      </v-col>

      <v-col class="d-flex" cols="12" style="margin-top: -150px">
        <logo-uploader
          label="Logo"
          class="mx-auto"
          v-model="logoPhotoData"
          :url="logoPhotoUrl"
          size="240"
          withBtn
        ></logo-uploader>
      </v-col>

      <v-col cols="9" class="mx-auto">
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Partylist Name*"
              outlined
              v-model="form.title"
              :rules="rules.title"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              label="Partylist Alias/Ticker *"
              outlined
              v-model="form.ticker"
              :rules="rules.ticker"
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Description"
              outlined
              v-model="form.description"
              hide-details="auto"
            ></v-text-field>
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
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import LogoUploader from "@/components/utils/LogoUploader.vue";
import CoverPhotoUploader from "@/components/utils/CoverPhotoUploader.vue";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import partyFormMixin from "@/mixins/forms/party-form.mixin";
import { Party } from "@/services/party.service";

export default mixins(manageElectionMixins, partyFormMixin).extend({
  props: {
    defaultData: {
      type: Object,
    } as PropOptions<Party>,
    updateFunc: Function,
  },
  data() {
    return {
      logoPhotoData: null,
      coverPhotoData: null,
    };
  },
  components: {
    LogoUploader,
    CoverPhotoUploader,
  },

  computed: {
    logoPhotoUrl(): string {
      return this.defaultData.logo.url;
    },
    coverPhotoUrl(): string {
      return this.defaultData.cover_photo?.url;
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

      (this.$refs.form as any).validate();

      if (this.valid) {
        try {
          await this.updateFunc({
            ...this.form,
            cover: this.coverPhotoData,
            logo: this.logoPhotoData,
          });
          this.reset();
        } catch (error: any) {
          console.log(error);
          if (error) {
            const message =
              error.response?.data?.error?.message || error.message;
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
  },

  watch: {
    defaultData: {
      deep: true,
      immediate: true,
      handler: function (value, oldVal) {
        this.form = Object.assign({}, value);
      },
    },
  },
});
</script>
