<template>
  <v-card width="450" flat>
    <v-card-title>
      <v-row class="mb-4" no-gutters>
        <v-col class="d-flex justify-center mb-2" md="12">
          <v-avatar size="80">
            <app-image
              :size="80"
              src="/tup-logo.png"
              alt="Technological University of the Philippines"
            />
          </v-avatar>
        </v-col>
        <v-col>
          <h1 class="headline text-center w-100" style="word-break: break-word">
            Technological University of the Philippines <br />
            <span class="font-weight-bold">Voting System</span>
          </h1>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card outlined flat class="px-2 py-6">
      <template v-if="showLogin">
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
      <template v-else>
        <disabled-account v-if="errors.disabledError" :reset="reset" />
        <attempts-error v-else-if="errors.attemptsError" :reset="reset" />
      </template>
    </v-card>
    <recaptcha @error="onError" @success="onSuccess" @expired="onExpired" />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import PasswordField from "@/components/input/PasswordField.vue";
import DisabledAccount from "@/components/pages/login/DisabledAccount.vue";
import AttemptsError from "@/components/pages/login/AttemptsError.vue";
import AppImage from "@/components/app/AppImage.vue";

const defaultForm = {
  usernameOrEmail: "christian.lugod@tup.email.ph",
  password: "",
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

const defaultErrors = {
  disabledError: false,
  attemptsError: false,
};

export default Vue.extend({
  components: {
    DisabledAccount,
    PasswordField,
    AttemptsError,
    AppImage,
  },
  data() {
    return {
      loading: false,
      valid: false,
      alert: Object.assign({}, defaultAlert),
      errors: Object.assign({}, defaultErrors),
      form: Object.assign({}, defaultForm),
    };
  },

  computed: {
    showLogin(): boolean {
      return !this.errors.disabledError && !this.errors.attemptsError;
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

          const result = await this.$auth.loginWith("local", {
            data: { ...this.form, token },
          });
          console.log(result);
        } catch (error: any) {
          if (error && error.response.data.error) {
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
                  this.errors.disabledError = true;
                } else if (message.attemptsError) {
                  this.errors.attemptsError = true;
                }

                console.log(this.showLogin);
              }
            }
          }
        } finally {
          await this.$recaptcha.reset();
          this.loading = false;
        }
    },
    onError(error) {
      console.log("Error happened:", error);
    },
    onSuccess(token) {
      console.log("Succeeded:", token);
    },
    onExpired() {
      console.log("Expired");
    },

    reset() {
      if ((this.$refs as any).form) {
        (this.$refs as any).form.reset();
        (this.$refs as any).form.resetValidation();
      }
      this.form = Object.assign({}, defaultForm);
      this.alert = Object.assign({}, defaultAlert);
      this.errors = Object.assign({}, defaultErrors);
    },
  },
});
</script>

<style>
</style>