<template>
  <v-row justify="center">
    <v-dialog v-model="open" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Add User</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Firstname"
                  outlined
                  v-model="form.firstname"
                  :rules="rules.firstname"
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
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
                <password-field
                  label="Password"
                  outlined
                  v-model="form.password"
                  :rules="rules.password"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12">
                <password-field
                  label="Confirm Password"
                  outlined
                  v-model="form.confirmPassword"
                  :rules="rules.confirmPassword"
                  hide-details="auto"
                />
              </v-col>

              <v-col cols="12">
                <role-select v-model="form.role" :rules="rules.role" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="open = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="open = false"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import ThemePicker from "../../pickers/ThemePicker.vue";
import LogoUploader from "@/components/utils/LogoUploader.vue";
import configs from "@/configs";
import PasswordField from "@/components/input/PasswordField.vue";
import RoleSelect from "../../input/RoleSelect.vue";

const defaultForm = {
  firstname: "",
  lastname: "",
  username: "",
  password: "",
  confirmPassword: "",
  role: "",
};

export default Vue.extend({
  props: {
    open: Boolean,
    createFunc: Function,
  },
  components: { ThemePicker, LogoUploader, PasswordField, RoleSelect },
  data() {
    return {
      valid: false,
      alert: {
        show: false,
        type: "",
        message: "",
      },

      loading: false,
      form: Object.assign({}, defaultForm),

      baseURL: configs.baseURL,
    };
  },

  computed: {
    rules() {
      return {
        fistname: [(v: any) => !!v || "Firstname is required"],
        lastname: [(v: any) => !!v || "Lastname is required"],
        username: [(v: any) => !!v || "Username Primary is required"],
        password: [(v: any) => !!v || "Password is required"],
        confirmPassword: [(v: any) => !!v || "Confirm Password is required"],
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
          await this.createFunc(this.form);
        } catch (error: any) {
          this.alert = {
            show: true,
            type: "error",
            message: error.message,
          };
        }
      }
      this.loading = false;
    },
  },
});
</script>