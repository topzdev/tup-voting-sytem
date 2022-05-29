<template>
  <v-form ref="form" v-model="valid">
    <v-row>
      <v-col v-if="alert.show" cols="12">
        <v-alert
          :type="alert.type"
          v-model="alert.show"
          dismissible
          class="mb-0"
        >
          {{ alert.message }}
        </v-alert>
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="Firstname"
          outlined
          v-model="form.firstname"
          :rules="rules.firstname"
          hide-details="auto"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field
          label="Lastname"
          outlined
          v-model="form.lastname"
          :rules="rules.lastname"
          hide-details="auto"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field
          label="Username"
          outlined
          v-model="form.username"
          :rules="rules.username"
          hide-details="auto"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field
          label="Email Address"
          outlined
          v-model="form.email_address"
          :rules="rules.email_address"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <role-select v-model="form.role" :rules="rules.role" />
      </v-col>

      <v-col cols="12" class="d-flex">
        <v-btn
          color="primary"
          :disabled="loading"
          :loading="loading"
          block
          large
          @click="submit"
        >
          Save
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import ThemePicker from "@/components/pickers/ThemePicker.vue";
import LogoUploader from "@/components/utils/LogoUploader.vue";
import configs from "@/configs";
import PasswordField from "@/components/input/PasswordField.vue";
import RoleSelect from "@/components/input/RoleSelect.vue";

const defaultForm = {
  firstname: "",
  lastname: "",
  username: "",
  email_address: "",
  role: "",
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default Vue.extend({
  props: {
    submitFunc: Function,
    cancelFunc: Function,
    isModal: Boolean,
  },
  components: { ThemePicker, LogoUploader, PasswordField, RoleSelect },
  data() {
    return {
      valid: false,
      alert: Object.assign({}, defaultAlert),
      loading: false,
      form: Object.assign({}, defaultForm),

      baseURL: configs.baseURL,
    };
  },

  computed: {
    rules(): any {
      return {
        firstname: [(v: any) => !!v || "Firstname is required"],
        lastname: [(v: any) => !!v || "Lastname is required"],
        username: [(v: any) => !!v || "Username is required"],
        email_address: [
          (v: any) => !!v || "Email Address is required",
          (v: any) => /.+@.+\..+/.test(v) || "Email Address must be valid",
        ],
        role: [(v: any) => !!v || "Role is required"],
      };
    },
  },

  methods: {
    async cancel() {
      if (this.cancelFunc) this.cancelFunc();
      this.reset();
    },
    async submit() {
      this.loading = true;

      (this.$refs as any).form.validate();

      if (this.valid) {
        try {
          if (this.submitFunc) await this.submitFunc(this.form);
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

    reset() {
      (this.$refs as any).form.reset();
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },
  },
});
</script>

<style>
</style>