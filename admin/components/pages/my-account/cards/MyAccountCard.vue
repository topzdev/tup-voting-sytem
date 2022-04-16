<template>
  <v-card outlined>
    <v-card-title> Account Information </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-alert type="info" class="mb-0" outlined dense>
            To update your information, Please contact your administrator.
          </v-alert>
        </v-col>

        <v-col cols="6">
          <v-text-field
            label="Firstname"
            outlined
            readonly
            v-model="form.firstname"
            hide-details="auto"
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-text-field
            label="Lastname"
            outlined
            readonly
            v-model="form.lastname"
            hide-details="auto"
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-text-field
            label="Username"
            outlined
            readonly
            v-model="form.username"
            hide-details="auto"
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-text-field
            label="Email Address"
            outlined
            readonly
            v-model="form.email_address"
            hide-details="auto"
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <role-select v-model="form.role" readonly />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import myAccountMixin from "@/mixins/my-account.mixins";
import { User } from "@/services/user.service";
import mixins from "vue-typed-mixins";
import RoleSelect from "@/components/input/RoleSelect.vue";
const defaultForm = {
  firstname: "",
  lastname: "",
  username: "",
  email_address: "",
  role: "",
};

export default mixins(myAccountMixin).extend({
  components: {
    RoleSelect,
  },
  data() {
    return {
      loading: false,
      form: Object.assign({}, defaultForm),
    };
  },

  watch: {
    account: {
      immediate: true,
      handler(account: User) {
        this.form = {
          username: account.username,
          firstname: account.firstname,
          lastname: account.lastname,
          email_address: account.email_address,
          role: account.role,
        };
      },
    },
  },
});
</script>