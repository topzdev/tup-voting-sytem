<template>
  <v-form ref="form" v-model="valid">
    <v-card :loading="pageLoading" outlined>
      <v-card-title>
        Organizational Terms and Condition

        <v-spacer />

        <v-btn
          text
          color="primary"
          :disabled="!valid || loading"
          :loading="loading"
          @click="submit"
          >Save</v-btn
        >
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <editor-field
          id="platform"
          label="Platform *"
          outlined
          v-model="form.terms_and_condition"
          hide-details="auto"
        />
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
import EditorField from "@/components/input/EditorField.vue";
import ThemePicker from "@/components/pickers/ThemePicker.vue";
import LogoUploader from "@/components/utils/LogoUploader.vue";
import configs from "@/configs";
import manageOrganizationMixin from "@/mixins/manage-organization.mixins";
import organizationServices from "@/services/organization.service";
import mixins from "vue-typed-mixins";

const defaultForm = {
  terms_and_condition: "",
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(manageOrganizationMixin).extend({
  components: { ThemePicker, LogoUploader, EditorField },

  data() {
    return {
      valid: false,
      alert: Object.assign({}, defaultAlert),
      loading: false,
      form: Object.assign({}, defaultForm),
      pageLoading: false,
      baseURL: configs.baseURL,
    };
  },
  computed: {},

  methods: {
    async submit() {
      try {
        const result = await organizationServices.updateTermsAndCondition({
          id: this.organizationId,
          terms_and_condition: this.form.terms_and_condition,
        });
        this.$accessor.snackbar.set({
          show: true,
          message: "Terms and Condition Updated!",
          timeout: 5000,
          color: "success",
        });
        this.$accessor.organization.refreshOrganization();
      } catch (error: any) {
        throw error.response.data.error;
      }
    },
  },
  watch: {
    organization: {
      deep: true,
      immediate: true,
      handler: function (value, oldVal) {
        this.form = Object.assign(
          {},
          {
            terms_and_condition: value.terms_and_condition,
          }
        );
      },
    },
  },
});
</script>