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
          v-model="form.cover"
          height="350"
          withBtn
        >
        </cover-photo-uploader>
      </v-col>

      <v-col class="d-flex" cols="12" style="margin-top: -150px">
        <logo-uploader
          label="Logo"
          class="mx-auto"
          v-model="form.logo"
          size="240"
          withBtn
        ></logo-uploader>
      </v-col>

      <v-col cols="9" class="mx-auto">
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Party name*"
              outlined
              v-model="form.title"
              :rules="rules.title"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              label="Party Alias/Ticker *"
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
import LogoUploader from "@/components/utils/LogoUploader.vue";
import CoverPhotoUploader from "@/components/utils/CoverPhotoUploader.vue";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import partyFormMixin from "@/mixins/forms/party-form.mixin";

export default mixins(manageElectionMixins, partyFormMixin).extend({
  components: {
    LogoUploader,
    CoverPhotoUploader,
  },
  props: {
    createFunc: Function,
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
