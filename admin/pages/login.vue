<template>
  <page-center>
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
            <h1
              class="headline text-center w-100"
              style="word-break: break-word"
            >
              Technological University of the Philippines <br />
              <span class="font-weight-bold">Voting System</span>
            </h1>
          </v-col>
        </v-row>
      </v-card-title>
      <template v-if="showLogin">
        <login-form
          v-if="!success"
          :setSuccess="setSuccess"
          :setError="setError"
        ></login-form>
        <login-verification-code-form
          v-else
          :data="success"
          :setSuccess="setSuccess"
          :setError="setError"
        />
      </template>
      <template v-else>
        <disabled-account v-if="errors.disabledError" :reset="reset" />
        <attempts-error v-else-if="errors.attemptsError" :reset="reset" />
      </template>
    </v-card>
    <recaptcha />
  </page-center>
</template>

<script lang="ts">
import LoginForm from "~/components/pages/login/forms/AdminLoginForm.vue";
import LoginVerificationCodeForm from "~/components/pages/login/forms/LoginVerificationCodeForm.vue";
import PageCenter from "@/components/utils/PageCenter.vue";
import Vue from "vue";
import { AdminLoginReturn } from "../services/auth.service";
import DisabledAccount from "@/components/pages/login/DisabledAccount.vue";
import AttemptsError from "@/components/pages/login/AttemptsError.vue";

export type ErrorTypes = "attempt-error" | "disabled-account";

const defaultErrors = {
  disabledError: false,
  attemptsError: false,
};

export default Vue.extend({
  auth: "guest",
  layout: "basic",

  components: {
    LoginForm,
    LoginVerificationCodeForm,
    PageCenter,
    DisabledAccount,
    AttemptsError,
  },
  head: {
    title: "Admin Login",
  },
  data() {
    return {
      success: null as AdminLoginReturn | null,
      errors: Object.assign({}, defaultErrors),
    };
  },

  computed: {
    showLogin(): boolean {
      return !this.errors.disabledError && !this.errors.attemptsError;
    },
  },

  methods: {
    setSuccess(data: AdminLoginReturn) {
      this.success = data;
    },
    setError(type: ErrorTypes) {
      switch (type) {
        case "attempt-error":
          this.errors.attemptsError = true;
          break;

        case "disabled-account":
          this.errors.disabledError = true;
          break;
      }
    },
    reset() {
      this.success = null;
      this.errors = Object.assign({}, defaultErrors);
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
  },
});
</script>