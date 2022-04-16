<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-card width="450" flat>
      <v-card-title>
        <v-row>
          <v-col class="d-flex justify-center" md="12">
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
      <v-card-text class="d-flex align-center">
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
              @click="submit"
              block
            >
              Login
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import PasswordField from "@/components/input/PasswordField.vue";
import AppImage from "@/components/app/AppImage.vue";

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
  components: {
    PasswordField,
    AppImage,
  },
  data() {
    return {
      loading: false,

      alert: {
        show: false,
        type: "",
        message: "",
      },
      valid: false,

      form: Object.assign({}, defaultForm),
    };
  },

  computed: {
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
          const result = await this.$auth.loginWith("local", {
            data: this.form,
          });

          console.log(result);

          if (result && result.data.error) {
            this.alert = {
              message: result.data.message,
              type: "error",
              show: true,
            };
          }
        } catch (error: any) {
          if (error && error.response.data.error) {
            const message =
              error.response?.data?.error?.message || error.message;

            if (message) {
              this.alert = {
                show: true,
                type: "error",
                message: message,
              };
            }
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

<style>
</style>