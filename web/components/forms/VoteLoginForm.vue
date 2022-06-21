<template>
  <v-form ref="form" lazy-validation>
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
          v-model="form.voter_id"
          :rules="rules.username"
          label="Voter ID"
          required
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <password-field
          outlined
          hide-details="auto"
          v-model="form.pin"
          :rules="rules.password"
          label="Pin"
          required
        ></password-field>
      </v-col>
      <v-col>
        <v-btn
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
      <v-col cols="12" class="text-center">
        <election-legal-text
          class="body-2 text--secondary"
          :election="election"
        />
      </v-col>

      <v-col class="text-center mt-2 mt-lg-5" cols="12">
        <v-btn to="/" large color="primary" text
          >Go to TUP Voting Homepage</v-btn
        >
      </v-col>
    </v-row>
    <recaptcha />
  </v-form>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import PasswordField from "@/components/inputs/PasswordField.vue";
import ElectionLegalText from "@/components/pages/election/ElectionLegalText.vue";
import AppImage from "@/components/app/AppImage.vue";
import { Election } from "../../types/app";

const defaultForm = {
  voter_id: "",
  pin: "",
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default Vue.extend({
  props: {
    election_id: Number,
    election: {
      type: Object,
    } as PropOptions<Election>,
  },

  components: {
    PasswordField,
    AppImage,
    ElectionLegalText,
  },
  data() {
    return {
      loading: false,

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
      this.loading = true;
      try {
        const slug = this.$route.params.slug;

        const token = await this.$recaptcha.getResponse();

        const result = await this.$auth.loginWith("local", {
          data: { ...this.form, election_id: this.election_id, token },
        });

        this.$router.push(`/vote/${slug}/ballot`);

        console.log(result);
      } catch (error: any) {
        if (error && error.response.data.error) {
          const message = error.response?.data?.error?.message || error.message;

          if (message) {
            this.alert = {
              show: true,
              type: "error",
              message: message,
            };
          }
        }
      } finally {
        await this.$recaptcha.reset();
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