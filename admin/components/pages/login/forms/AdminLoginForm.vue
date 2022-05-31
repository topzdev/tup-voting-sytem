<template>
  <v-card outlined flat class="px-2 py-6">
    <template>
      <v-card-text class="d-flex align-center">
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
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
                outlined
                v-model="form.usernameOrEmail"
                :rules="rules.usernameOrEmail"
                label="Username or Email Address"
                required
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <password-field
                outlined
                hide-details="auto"
                v-model="form.password"
                :rules="rules.password"
                label="Password"
                required
              ></password-field>
            </v-col>
            <v-col>
              <v-btn
                type="submit"
                color="primary"
                :loading="loading"
                :disabled="loading"
                large
                block
              >
                Login
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </template>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import PasswordField from "@/components/input/PasswordField.vue";
import AppImage from "@/components/app/AppImage.vue";
import authServices, { AdminLoginReturn } from "@/services/auth.service";
import { ErrorTypes } from "@/pages/login.vue";

const defaultForm = {
  usernameOrEmail: "",
  password: "",
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default Vue.extend({
  props: {
    setSuccess: {
      type: Function,
    } as PropOptions<(data: AdminLoginReturn) => void>,

    setError: {
      type: Function,
    } as PropOptions<(type: ErrorTypes) => void>,
  },

  components: {
    PasswordField,
    AppImage,
  },
  data() {
    return {
      loading: false,
      valid: false,
      alert: Object.assign({}, defaultAlert),
      form: Object.assign({}, defaultForm),
    };
  },

  computed: {
    showVerificationPage(): boolean {
      return true;
    },

    rules() {
      return {
        usernameOrEmail: [
          (v: string) => !!v || "Username or Email Address is required",
        ],
        password: [(v: string) => !!v || "Password is required"],
      };
    },
  },

  methods: {
    async submit() {
      (this.$refs as any).form.validate();

      if (this.valid)
        try {
          this.loading = true;

          const token = await this.$recaptcha.getResponse();

          // const result = await this.$auth.loginWith("local", {
          //   data: { ...this.form, token },
          // });
          const result = await authServices.adminLogin({
            ...this.form,
            token,
          });

          console.log(result);

          this.setSuccess(result);
        } catch (error: any) {
          console.log(error);
          if (error || error.response.data.error) {
            const message =
              error.response?.data?.error?.message || error.message;

            console.log(message);

            if (message) {
              if (typeof message === "string") {
                this.alert = {
                  show: true,
                  type: "error",
                  message: message,
                };
              } else if (typeof message === "object") {
                if (message.disabledError) {
                  this.setError("disabled-account");
                } else if (message.attemptsError) {
                  this.setError("attempt-error");
                }
              }
            }
          }
        } finally {
          await this.$recaptcha.reset();
          this.loading = false;
        }
    },

    reset() {
      if ((this.$refs as any).form) {
        (this.$refs as any).form.reset();
        (this.$refs as any).form.resetValidation();
      }
      this.form = Object.assign({}, defaultForm);
      this.alert = Object.assign({}, defaultAlert);
    },
  },
});
</script>

<style>
</style>