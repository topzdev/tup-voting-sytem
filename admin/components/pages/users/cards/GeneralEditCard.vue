<template>
  <v-card outlined>
    <v-card-title> User Information </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-form ref="form" v-model="valid">
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
          <v-col cols="6">
            <v-text-field
              label="Firstname"
              outlined
              v-model="form.firstname"
              :rules="rules.firstname"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <v-text-field
              label="Lastname"
              outlined
              v-model="form.lastname"
              :rules="rules.lastname"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              label="Username"
              outlined
              v-model="form.username"
              :rules="rules.username"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              label="Email Address"
              outlined
              v-model="form.email_address"
              :rules="rules.email_address"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" class="d-flex">
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="!valid || loading"
              :loading="loading"
              large
              @click="submit"
            >
              Save
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import userServices, { User } from "@/services/user.service";
import UserEditForm from "../forms/UserEditForm.vue";
import configs from "@/configs";
import mixins from "vue-typed-mixins";
import editUserMixin from "@/mixins/edit-user";
import pageConfig from "~/configs/pages.config";

const defaultForm = {
  firstname: "",
  lastname: "",
  id: 0,
  username: "",
  email_address: "",
};

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
      form: Object.assign({}, defaultForm),
    };
  },

  computed: {
    rules(): any {
      return {
        firstname: [(v: any) => !!v || "Firstname is required"],
        lastname: [(v: any) => !!v || "Lastname is required"],
        username: [(v: any) => !!v || "Username Primary is required"],
        role: [(v: any) => !!v || "Role is required"],
      };
    },
  },

  methods: {
    async submit() {
      this.loading = true;

      (this.$refs as any).form.validate();

      if (this.valid) {
        try {
          const result = await userServices.update(this.form);

          this.$accessor.snackbar.set({
            show: true,
            message: "User Successfully Updated!",
            timeout: 5000,
            color: "success",
          });

          this.$accessor.user.refetchUser();
          this.reset();
        } catch (error: any) {
          const message = error.response?.data?.error?.message || error.message;

          if (message) {
            this.alert = {
              show: true,
              type: "error",
              message: message,
            };
          }
        }
      }
      this.loading = false;
    },

    reset() {
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },
  },

  watch: {
    user: {
      immediate: true,
      handler(user: User) {
        this.form = {
          id: user.id,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          email_address: user.email_address,
        };
      },
    },
  },
});
</script>