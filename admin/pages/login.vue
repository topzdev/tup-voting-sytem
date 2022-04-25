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
      <login-form v-if="success"></login-form>
      <login-verification-code-form v-else />
    </v-card>
  </page-center>
</template>

<script lang="ts">
import LoginForm from "~/components/pages/login/forms/LoginForm.vue";
import LoginVerificationCodeForm from "~/components/pages/login/forms/LoginVerificationCodeForm.vue";
import PageCenter from "@/components/utils/PageCenter.vue";
import Vue from "vue";
import { AdminLoginReturn } from "../services/auth.service";

export default Vue.extend({
  auth: "guest",
  layout: "basic",

  components: {
    LoginForm,
    LoginVerificationCodeForm,
    PageCenter,
  },
  head: {
    title: "Admin Login",
  },
  data() {
    return {
      success: null as AdminLoginReturn | null,
    };
  },

  methods: {
    setSuccess(data: AdminLoginReturn) {
      this.success = data;
    },
  },
});
</script>