<template>
  <v-form ref="form" v-model="valid">
    <v-dialog v-model="show" persistent max-width="600px">
      <v-card>
        <v-card-title class="py-5">
          <span class="text-h5">Add Election Officer</span>
        </v-card-title>

        <v-card-text class="mt-2">
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
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn class="mr-auto" large text @click="closeDialog">Cancel</v-btn>
          <v-btn
            color="primary"
            :disabled="loading"
            :loading="loading"
            large
            text
            @click="submit"
            >Submit</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import electionOfficerServices from "@/services/election-officer.service";
import { Organization } from "../../../../services/organization.service";
const defaultForm = {
  firstname: "",
  lastname: "",
  username: "",
  email_address: "",
  role: "",
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};
export default Vue.extend({
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    organizationId: {
      type: Number,
    } as PropOptions<Organization["id"]>,

    refresh: {
      type: Function,
    },
  },

  data() {
    return {
      valid: false,
      alert: Object.assign({}, defaultAlert),
      form: Object.assign({}, defaultForm),
      loading: false,
    };
  },
  computed: {
    rules(): any {
      return {
        firstname: [(v: any) => !!v || "Firstname is required"],
        lastname: [(v: any) => !!v || "Lastname is required"],
        username: [(v: any) => !!v || "Username is required"],
        email_address: [
          (v: any) => !!v || "Email Address is required",
          (v: any) => /.+@.+\..+/.test(v) || "Email Address must be valid",
        ],
      };
    },
  },
  watch: {},

  methods: {
    async submit() {
      this.loading = true;

      (this.$refs as any).form.validate();

      if (this.valid) {
        try {
          const response = await electionOfficerServices.create({
            ...this.form,
            organization_id: this.organizationId,
          });
          this.$accessor.snackbar.set({
            show: true,
            message: "Election Officer Added",
            timeout: 5000,
            color: "success",
          });

          this.closeDialog();

          await this.refresh();
        } catch (error: any) {
          const message = error.response?.data?.error?.message || error.message;
          this.alert = {
            show: true,
            type: "error",
            message: message,
          };
        } finally {
          this.loading = false;
        }
      }
    },
    closeDialog() {
      this.$emit("update:show", false);
    },
  },
});
</script>

<style>
</style>