<template>
  <v-row justify="center">
    <v-dialog v-model="isOpenLocal" persistent width="600px" max-width="600px">
      <v-card :loading="$fetchState.pending">
        <v-card-title>
          <span class="text-h5">Change Password</span>
        </v-card-title>
        <v-divider class="mb-5"></v-divider>

        <v-card-text v-if="!$fetchState.pending && !$fetchState.error">
          <user-change-password-form
            :cancelFunc="cancelFunc"
            :defaultData="defaultData"
            :submitFunc="submitFunc"
          ></user-change-password-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import userServices from "@/services/user.service";
import UserChangePasswordForm from "../forms/UserChangePasswordForm.vue";

export default Vue.extend({
  props: {
    isOpen: Boolean,
    fetchFunc: Function,
  },

  components: {
    UserChangePasswordForm,
  },

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
        const result = await userServices.changePassword(body);
        this.$accessor.snackbar.set({
          show: true,
          message: "Password Successfully Changed!",
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