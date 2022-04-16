<template>
  <v-form ref="form" v-model="valid">
    <v-card outlined>
      <v-card-title> Enable or Disable Account </v-card-title>
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
            <p class="body-1 mb-0" v-html="message"></p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          @click="submit"
          :loading="loading"
          :disabled="loading"
          large
          :color="buttonColor"
          v-text="buttonText"
        ></v-btn>
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

  computed: {
    buttonText(): string {
      return this.statusText(!this.status) + " Account";
    },

    buttonColor(): string {
      return this.statusColor(!this.status);
    },

    message(): string {
      const currentStatus = this.statusText(this.status) + "d";
      const currentColor = this.statusColor(this.status) + "--text";
      const toStatus = this.statusText(!this.status);
      const toStatusColor = this.statusColor(!this.status) + "--text";
      const finalMessage = !this.status
        ? "Disabled account will probihited the access of the user in any part of the system."
        : "";
      return `The account is currently <b class="${currentColor}">${currentStatus}</b>, to <b class="${toStatusColor}">${toStatus}</b> this account click the button below. ${finalMessage} `;
    },

    status() {
      if (!this.user) return false;
      return this.user.disabled;
    },
  },

  methods: {
    statusText(is: boolean): string {
      return is ? "Disable" : "Enable";
    },

    statusColor(is: boolean): string {
      return is ? "error" : "success";
    },
    async submit() {
      console.log("Hello");
      this.$accessor.system.showAppDialog({
        show: true,
        title: this.statusText(!this.status) + " Account",
        message: `Are you sure to ${this.statusText(
          !this.status
        )}  this account?`,
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            if (this.valid) {
              this.loading = true;
              try {
                const result = await userServices.disableUser({
                  id: this.userId,
                  disabled: !this.status,
                });
                this.$accessor.snackbar.set({
                  show: true,
                  message: `Account Succesfully ${this.statusText(
                    !this.status
                  )}d`,
                  timeout: 5000,
                  color: "success",
                });

                this.$accessor.user.refetchUser();
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