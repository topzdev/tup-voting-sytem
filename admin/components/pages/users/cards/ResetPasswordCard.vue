<template>
  <v-form ref="form" v-model="valid">
    <v-card outlined>
      <v-card-title> Reset Password </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row no-gutters>
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
            <p class="body-1 mb-0">
              The account password will reset back to "username-lastname". The
              user must immediately change the password after the said action.
            </p>
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
          >Reset Password</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import editUserMixin from "@/mixins/edit-user";
import userServices from "@/services/user.service";
import mixins from "vue-typed-mixins";
import UserEditForm from "../forms/UserEditForm.vue";

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(editUserMixin).extend({
  components: {
    UserEditForm,
  },

  data() {
    return {
      valid: false,
      alert: Object.assign({}, defaultAlert),
      loading: false,
    };
  },

  computed: {},

  methods: {
    async submit() {
      console.log("Hello");
      this.$accessor.system.showAppDialog({
        show: true,
        title: "Reset Password",
        message: "Are you sure to reset the account password?",
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            if (this.valid) {
              this.loading = true;
              try {
                const result = await userServices.resetPassword(this.userId);
                this.$accessor.snackbar.set({
                  show: true,
                  message: "Password Reset Succesfully",
                  timeout: 5000,
                  color: "success",
                });
              } catch (error: any) {
                const message =
                  error.response?.data?.error?.message || error.message;

                if (message) {
                  this.alert = {
                    show: true,
                    type: "error",
                    message: message,
                  };
                }
              } finally {
                hideDialog();
                this.loading = false;
              }
            }
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },

    reset() {
      (this.$refs as any).form.reset();
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },
  },
});
</script>