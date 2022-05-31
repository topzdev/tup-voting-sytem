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
          v-model="form.cover_photo"
          height="350"
          withBtn
        >
        </cover-photo-uploader>

        <!-- <v-checkbox
          style="position: absolute; bottom: 10; left: 10"
          v-model="form.use_party_cover_photo"
          label="Use Party Cover Photo"
        ></v-checkbox> -->
      </v-col>

      <v-col class="d-flex" cols="12" style="margin-top: -150px">
        <logo-uploader
          label="Profile Photo *"
          class="mx-auto"
          v-model="form.profile_photo"
          size="240"
          withBtn
        ></logo-uploader>
      </v-col>

      <v-col cols="9" class="mx-auto">
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="First Name *"
              outlined
              v-model="form.firstname"
              :rules="rules.firstname"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <v-text-field
              label="Middle Name"
              outlined
              v-model="form.middlename"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <v-text-field
              label="Last Name *"
              outlined
              v-model="form.lastname"
              :rules="rules.lastname"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-textarea
              label="Description *"
              outlined
              v-model="form.description"
              :rules="rules.description"
              hide-details="auto"
            ></v-textarea>
          </v-col>

          <v-col cols="12">
            <label class="body-2 mb-1 d-flex" for="platform">Platform *</label>
            <editor-field
              id="platform"
              label="Platform *"
              outlined
              v-model="form.platform"
              :rules="rules.platform"
              hide-details="auto"
            >
            </editor-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              label="LinkedIn Url"
              outlined
              v-model="form.linkedin_url"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              label="Facebook Url"
              outlined
              v-model="form.facebook_url"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              label="Twitter Url"
              outlined
              v-model="form.twitter_url"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              label="Instagram Url"
              outlined
              v-model="form.insta_url"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              label="Website Url"
              outlined
              v-model="form.website_url"
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
import PartyPicker from "@/components/pickers/PartyPicker.vue";
import PositionPicker from "@/components/pickers/PositionPicker.vue";
import LogoUploader from "@/components/utils/LogoUploader.vue";
import CoverPhotoUploader from "@/components/utils/CoverPhotoUploader.vue";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import EditorField from "@/components/input/EditorField.vue";
import candidateFormMixin from "@/mixins/forms/candidate-form.mixin";

export default mixins(manageElectionMixins, candidateFormMixin).extend({
  components: {
    PartyPicker,
    PositionPicker,
    LogoUploader,
    CoverPhotoUploader,
    EditorField,
  },
  props: {
    createFunc: Function,
  },

  methods: {
    async submit() {
      if (!this.form.profile_photo) {
        return (this.alert = {
          show: true,
          type: "error",
          message: "Profile Photo is required",
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
  },

  computed: {},
});
</script>
