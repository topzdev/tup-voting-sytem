<template>
  <v-form ref="form" v-model="valid">
    <v-card outlined>
      <v-card-title> Remove Account </v-card-title>
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
          <v-col cols="8">
            <p class="body-1">
              Type current account "username" to continue removing this account.
            </p>

            <v-text-field
              outlined
              v-model="form.verify"
              hide-details="auto"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          @click="submit"
          :loading="loading"
          :disabled="!verified"
          large
          color="error"
          >Remove Account</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import editUserMixin from "@/mixins/edit-user";
import userServices from "@/services/user.service";
import mixins from "vue-typed-mixins";
import pageConfig from "@/configs/pages.config";
import pageRoles from "@/configs/page-roles";
import UserEditForm from "../forms/UserEditForm.vue";
import authMixin from "../../../../mixins/auth.mixins";

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(editUserMixin, authMixin).extend({
  components: {
    UserEditForm,
  },

  data() {
    return {
      form: {
        verify: "",
      },
      valid: false,
      verified: false,
      alert: Object.assign({}, defaultAlert),
      loading: false,
    };
  },

  computed: {},

  watch: {
    "form.verify": {
      handler(value) {
        if (value === this.user?.username) {
          this.verified = true;
        } else {
          this.verified = false;
        }
      },
    },
  },

  methods: {
    async submit() {
      this.$accessor.system.showAppDialog({
        show: true,
        title: "Remove Account",
        message: "Are you sure to remove this account?",
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            if (this.verified) {
              this.systemAuthentication(
                {
                  button: {
                    yesFunction: async () => {
                      await this.removeUser(hideDialog);
                    },
                  },
                },
                "current-only-password",
                pageRoles.dialogs.removeAccount
              );
            }
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },

    async removeUser(hideDialog) {
      this.loading = true;
      try {
        const result = await userServices.delete(this.userId);
        this.$accessor.snackbar.set({
          show: true,
          message: "Account succesfully removed",
          timeout: 5000,
          color: "success",
        });

        this.$router.push(pageConfig.users().this().route);
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
        hideDialog();
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