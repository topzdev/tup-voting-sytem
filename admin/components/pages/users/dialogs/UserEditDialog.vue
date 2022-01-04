<template>
  <v-row justify="center">
    <v-dialog v-model="isOpenLocal" persistent width="600px" max-width="600px">
      <v-card :loading="$fetchState.pending">
        <v-card-title>
          <span class="text-h5">Edit User</span>
        </v-card-title>

        <v-card-text v-if="!$fetchState.pending && !$fetchState.error">
          <user-edit-form
            :isModal="true"
            :cancelFunc="cancelFunc"
            :submitFunc="submitFunc"
            :defaultData="defaultData"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import userServices from "@/services/user.service";
import UserEditForm from "../forms/UserEditForm.vue";

export default Vue.extend({
  props: {
    isOpen: Boolean,
    fetchFunc: Function,
  },

  components: {
    UserEditForm,
  },

  data() {
    return {
      isOpenLocal: this.isOpen,
      defaultData: null,
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
      this.defaultData = await userServices.getById(id);
      console.log(this.defaultData);
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    cancelFunc() {
      this.$nuxt.$router.push("/settings/user");
    },

    async submitFunc(body: any) {
      try {
        const result = await userServices.update(body);
        this.$accessor.snackbar.set({
          show: true,
          message: "User Successfully Updated!",
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