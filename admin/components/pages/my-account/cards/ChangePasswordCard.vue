<template>
  <v-form ref="form" v-model="valid">
    <v-card outlined>
      <v-card-title> Change Password </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
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
          <v-col cols="8">
            <password-field
              label="Current Password"
              outlined
              v-model="form.currentPassword"
              :rules="rules.currentPassword"
              hide-details="auto"
            ></password-field>
          </v-col>

          <v-col cols="8">
            <password-field
              label="New Password"
              outlined
              v-model="form.newPassword"
              :rules="rules.newPassword"
              hide-details="auto"
            ></password-field>
          </v-col>

          <v-col cols="8">
            <password-field
              label="Confirm Password"
              outlined
              v-model="form.confirmPassword"
              :rules="rules.confirmPassword"
              hide-details="auto"
            ></password-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          @click="submit"
          :loading="loading"
          :disabled="loading"
          large
          color="primary"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import editUserMixin from "@/mixins/edit-user";
import userServices from "@/services/user.service";
import mixins from "vue-typed-mixins";
import PasswordField from "@/components/input/PasswordField.vue";
import myAccountMixin from "@/mixins/my-account.mixins";
const defaultForm = {
  newPassword: "",
  confirmPassword: "",
  currentPassword: "",
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(myAccountMixin).extend({
  components: {
    PasswordField,
  },

  data() {
    return {
      valid: false,
      alert: Object.assign({}, defaultAlert),
      loading: false,
      form: Object.assign({}, defaultForm),
    };
  },

  computed: {
    rules(): any {
      return {
        currentPassword: [(v: any) => !!v || "Current Password is required"],
        newPassword: [(v: any) => !!v || "Password is required"],
        confirmPassword: [
          (v: any) => !!v || "Confirm Password is required",
          (v: any) =>
            !!this.confirmPasswordMatch() || "Confirm password must match",
        ],
      };
    },
  },

  methods: {
    confirmPasswordMatch() {
      return this.form.confirmPassword === this.form.newPassword;
    },

    async submit() {
      (this.$refs as any).form.validate();

      if (this.valid) {
        this.$accessor.system.showAppDialog({
          show: true,
          title: "Change Password",
          message: "Are you sure to change your password",
          button: {
            anyEventHide: false,
            yesFunction: async ({ hideDialog }) => {
              this.changePassword(hideDialog);
            },
            noFunction: ({ hideDialog }) => {
              hideDialog();
            },
          },
        });
      }
    },

    async changePassword(hideDialog) {
      this.loading = true;
      try {
        const result = await userServices.changePassword(this.form);

        this.$accessor.snackbar.set({
          show: true,
          message: "Account Password Updated!",
          timeout: 5000,
          color: "success",
        });

        this.reset();

        return this.$accessor.system.showAppDialog({
          show: true,
          title: "Account Verification",
          message:
            "Since you change your password, We need you to re-login to verify it's you. We automatically logout your account within 5 seconds or just click the logout button",
          button: {
            anyEventHide: false,
            yesLabel: "Logout",
            yesFunction: async ({ hideDialog }) => {
              await this.$auth.logout();
              hideDialog();
            },
            showNo: false,
          },
        });
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
    },
    reset() {
      (this.$refs as any).form.reset();
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },
  },
});
</script>