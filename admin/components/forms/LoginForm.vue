<template>
  <v-form ref="form" lazy-validation>
    <v-card width="450" flat>
      <v-card-title>
        <v-row>
          <v-col class="d-flex justify-center" md="12">
            <v-avatar size="80">
              <img
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
              v-model="form.username"
              :rules="rules.username"
              label="Username"
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
            <v-btn color="primary" large @click="submit" block> Login </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import PasswordField from "@/components/input/PasswordField.vue";

const defaultForm = {
  username: "dummy",
  password: "12345678",
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default Vue.extend({
  components: {
    PasswordField,
  },
  data() {
    return {
      alert: {
        show: false,
        type: "",
        message: "",
      },

      form: Object.assign({}, defaultForm),
    };
  },

  computed: {
    rules() {
      return {
        username: [(v: string) => !!v || "Username is required"],
        password: [(v: string) => !!v || "Password is required"],
      };
    },
  },

  methods: {
    async submit() {
      try {
        const result = await this.$auth.loginWith("local", {
          data: this.form,
        });

        if (result && result.data.error) {
          this.alert = {
            message: result.data.message,
            type: "error",
            show: true,
          };
        }

        this.reset();
      } catch (error: any) {}
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