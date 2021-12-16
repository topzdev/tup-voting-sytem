<template>
  <v-row justify="center">
    <v-dialog v-model="isOpenLocal" persistent width="600px" max-width="600px">
      <v-card :loading="$fetchState.pending">
        <v-card-title>
          <span class="text-h5">Reset Password</span>
        </v-card-title>

        <v-card-text v-if="!$fetchState.pending && !$fetchState.error">
          <user-reset-password-form
            :cancelFunc="cancelFunc"
            :defaultData="defaultData"
            :submitFunc="submitFunc"
          ></user-reset-password-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import userServices from "@/services/user.service";
import UserResetPasswordForm from "./UserResetPasswordForm.vue";

export default Vue.extend({
  props: {
    isOpen: Boolean,
    fetchFunc: Function,
  },

  components: { UserResetPasswordForm },

  data() {
    const defaultData: any = null;

    return {
      isOpenLocal: this.isOpen,
      defaultData,
    };
  },

  watch: {
    isOpen(value) {
      this.isOpenLocal = value;
    },
    isOpenLocal(value) {
      this.$emit("update:isOpen", value);
    },
  },

  fetchOnServer: false,
  async fetch() {
    try {
      const id = this.$nuxt.$route.params.id;
      this.defaultData = Object.assign({}, { userId: parseInt(id) });
      console.log(this.defaultData);
    } catch (error: any) {
      throw error.response.data.error;
    }
  },

  methods: {
    cancelFunc() {
      this.$nuxt.$router.push("/settings/user");
    },

    async submitFunc(body: any) {
      try {
        console.log(body);
        const result = await userServices.resetPassword(body.userId);
        this.$accessor.snackbar.set({
          show: true,
          message: "Password Reset Successfully!",
          timeout: 5000,
          color: "success",
        });
        this.$nuxt.$router.push("/settings/user");
      } catch (error: any) {
        throw error.response.data.error;
      }
    },
  },
});
</script>