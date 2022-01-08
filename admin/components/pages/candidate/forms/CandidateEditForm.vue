<template>
  <v-form ref="form" v-model="valid">
    <v-row>
      <v-col v-if="alert.show" cols="12" class="pb-0">
        <v-alert :type="alert.type" class="mb-0" dismissible>
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

        <v-checkbox
          style="position: absolute; bottom: 10; left: 10"
          v-model="form.use_party_cover_photo"
          label="Use Party Cover Photo"
        ></v-checkbox>
      </v-col>

      <v-col class="d-flex" cols="12" style="margin-top: -150px">
        <logo-uploader
          label="Profile Photo"
          description=""
          class="mx-auto"
          v-model="profilePhotoData"
          :url="profilePhotoUrl"
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
              label="Middle Name *"
              outlined
              v-model="form.middlename"
              :rules="rules.middlename"
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

          <v-col cols="6">
            <party-picker
              v-model="form.party_id"
              :electionId="electionId"
            ></party-picker>
          </v-col>

          <v-col cols="6">
            <position-picker
              label="Position *"
              v-model="form.position_id"
              :rules="rules.position_id"
              :electionId="electionId"
            ></position-picker>
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
            <editor-field
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
import Vue, { PropOptions } from "vue";
import configs from "@/configs";
import mixins from "vue-typed-mixins";
import PartyPicker from "@/components/pickers/PartyPicker.vue";
import PositionPicker from "@/components/pickers/PositionPicker.vue";
import LogoUploader from "@/components/utils/LogoUploader.vue";
import CoverPhotoUploader from "@/components/utils/CoverPhotoUploader.vue";
import EditorField from "@/components/input/EditorField.vue";
import candidateFormMixin from "@/mixins/forms/candidate-form.mixin";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import { Candidate } from "../../../../services/candidate.service";

export default mixins(candidateFormMixin, manageElectionMixins).extend({
  props: {
    defaultData: {
      type: Object,
    } as PropOptions<Candidate>,
    updateFunc: Function,
  },
  data() {
    return {
      profilePhotoData: null,
      coverPhotoData: null,
    };
  },
  components: {
    PartyPicker,
    PositionPicker,
    LogoUploader,
    CoverPhotoUploader,
    EditorField,
  },

  computed: {
    profilePhotoUrl(): string {
      return this.defaultData.profile_photo.url;
    },
    coverPhotoUrl(): string {
      return this.defaultData.cover_photo.url;
    },
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

      if (!this.form.cover_photo) {
        return (this.alert = {
          show: true,
          type: "error",
          message: "Cover Photo is required",
        });
      }

      this.loading = true;

      (this.$refs.form as any).validate();

      if (this.valid) {
        try {
          await this.updateFunc({
            ...this.form,
            profile_photo: this.profilePhotoData,
            cover_photo: this.coverPhotoData,
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
        const socials = value.socials;

        delete value.socials;
        delete socials.id;

        this.form = Object.assign(
          {},
          {
            ...value,
            ...socials,
          }
        );
      },
    },
  },
});
</script>

