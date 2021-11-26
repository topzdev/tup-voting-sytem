<template>
  <v-form ref="form" lazy-validation>
    <v-card width="450" flat>
      <v-card-title>
        <v-row>
          <v-col class="d-flex justify-center" md="12">
            <v-avatar size="75">
              <img src="~/assets/img/tup-logo.png" alt="John" />
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
      <v-card-text class="d-flex align-center">
        <v-row>
          <v-col cols="12">
            <v-text-field
              outlined
              v-model="credentials.username"
              :rules="rules.username"
              label="Username"
              required
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              outlined
              hide-details="auto"
              v-model="credentials.password"
              :rules="rules.password"
              label="Password"
              :type="passwordType"
              required
              :append-icon="passwordIcon"
              @click:append="passwordToggle = !passwordToggle"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-btn color="primary" large @click="submit" block> Login </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      passwordToggle: false,
      credentials: {
        username: "dummy",
        password: "12345678",
      },
      rules: {
        username: [(v: string) => !!v || "Username is required"],
        password: [(v: string) => !!v || "Password is required"],
      },
    };
  },

  computed: {
    passwordType(): string {
      return !this.passwordToggle ? "password" : "text";
    },
    passwordIcon(): string {
      return this.passwordToggle ? "mdi-eye" : "mdi-eye-off";
    },
  },

  methods: {
    async submit() {
      const response = await this.$auth.loginWith("local", {
        data: this.credentials,
      });

      console.log(response);
    },
  },
});
</script>

<style>
</style>