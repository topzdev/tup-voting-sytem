<template>
  <v-dialog v-model="show" persistent :min-width="width" :width="width">
    <v-form ref="form" v-model="valid">
      <v-card>
        <v-card-title class="text-h5" v-html="title"> </v-card-title>
        <v-card-text>
          <p v-html="message"></p>

          <v-row>
            <v-col v-if="alert.show" cols="12">
              <v-alert
                dense
                :type="alert.type"
                v-model="alert.show"
                dismissible
                class="mb-0"
              >
                {{ alert.message }}
              </v-alert>
            </v-col>
            <v-col v-if="fieldsShow.usernameOrEmail" cols="12">
              <v-text-field
                outlined
                v-model="form.usernameOrEmail"
                :rules="rules.usernameOrEmail"
                label="Username or Email Address"
                required
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col v-if="fieldsShow.password" cols="12">
              <password-field
                outlined
                hide-details="auto"
                v-model="form.password"
                :rules="rules.password"
                label="Password"
                required
              ></password-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions :class="[buttonSpaceBetweenClass]">
          <v-btn color="primary" text @click="noFunc"> {{ noLabel }} </v-btn>
          <v-btn color="primary" text @click="yesFunc"> {{ yesLabel }} </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import {
  AppDialogConfig,
  AuthenticationDialogConfig,
  AuthenticationDialogType,
} from "@/store/system";
import PasswordField from "@/components/input/PasswordField.vue";
import authServices, {
  SystemLoginCredentials,
  UserRoles,
} from "../../services/auth.service";
import { UserRole } from "../../services/user.service";

const defaultForm: SystemLoginCredentials = {
  usernameOrEmail: "",
  password: "",
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

const fieldShow = {
  usernameOrEmail: true,
  password: true,
};

export default Vue.extend({
  components: { PasswordField },

  data() {
    return {
      width: 550,
      show: false,
      valid: false,
      fieldsShow: Object.assign({}, fieldShow),
      form: Object.assign({}, defaultForm),
      alert: Object.assign({}, defaultAlert),
    };
  },

  computed: {
    dialog(): AuthenticationDialogConfig {
      return this.$accessor.system.dialogs.authentication;
    },

    type(): AuthenticationDialogType | undefined {
      return this.dialog.type;
    },

    rules() {
      return {
        usernameOrEmail: [(v: string) => !!v || "Username is required"],
        password: [(v: string) => !!v || "Password is required"],
      };
    },

    title(): string {
      return this.dialog.title || "Authentication Dialog";
    },
    message(): string {
      return (
        this.dialog.message || "Please enter your credentials to continue."
      );
    },

    yesLabel(): string {
      return this.dialog.button?.yesLabel || "Confirm";
    },
    noLabel(): string {
      return this.dialog.button?.noLabel || "Cancel";
    },

    buttonSpaceBetweenClass(): string {
      return this.dialog.button?.spaceBetween
        ? "justify-space-between"
        : "justify-end";
    },
  },

  methods: {
    reset() {
      (this.$refs as any).form.reset();
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },

    hideDialog() {
      this.show = false;
      const self = this;
      this.reset();
      setTimeout(function () {
        self.$accessor.system.resetAutheticationDialog();
      }, 200);
    },

    async noFunc() {
      if (this.dialog.button?.noFunction) {
        await this.dialog.button.noFunction({ hideDialog: this.hideDialog });
      } else {
        this.hideDialog();
      }
    },
    async yesFunc() {
      (this.$refs as any).form.validate();

      if (this.valid) {
        let allowedRoles: UserRoles[] | UserRoles | undefined =
          this.dialog.allowedRoles;

        try {
          const result = await authServices.systemLogin({
            ...this.form,
            allowedRoles,
          });

          console.log(result);

          if (this.dialog.button?.yesFunction) {
            await this.dialog.button.yesFunction();
          }

          this.hideDialog();
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
    },
  },

  watch: {
    ["$accessor.system.dialogs.authentication"]: {
      handler(val: AuthenticationDialogConfig) {
        this.show = val.show;
        switch (val.type) {
          case "current":
            this.form = {
              usernameOrEmail: val.default?.usernameOrEmail || "",
              password: val.default?.password || "",
            };
            this.fieldsShow = fieldShow;
            break;

          case "current-only-password":
            this.form = {
              usernameOrEmail: val.default?.usernameOrEmail,
            };

            this.fieldsShow = {
              usernameOrEmail: false,
              password: true,
            };
            break;

          default:
            this.form = defaultForm;
            this.fieldsShow = fieldShow;
        }
      },
    },
  },
});
</script>

<style>
</style>