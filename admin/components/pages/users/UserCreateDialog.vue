<template>
  <v-row justify="center">
    <v-dialog v-model="isOpenLocal" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Add User</span>
        </v-card-title>

        <v-card-text>
          <user-create-form
            :isModal="true"
            :cancelFunc="cancelFunc"
            :submitFunc="submitFunc"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import userServices from "@/services/user.service";
import UserCreateForm from "./UserCreateForm.vue";

export default Vue.extend({
  props: {
    isOpen: Boolean,
    fetchFunc: Function,
  },

  components: {
    UserCreateForm,
  },

  data() {
    return {
      isOpenLocal: this.isOpen,
    };
  },

  computed: {},

  watch: {
    isOpen(value) {
      this.isOpenLocal = value;
    },
    isOpenLocal(value) {
      this.$emit("update:isOpen", value);
    },
  },

  methods: {
    cancelFunc() {
      this.isOpenLocal = false;
      this.$nuxt.$router.push("/settings/user");
    },

    async submitFunc(body: any) {
      try {
        const result = await userServices.create(body);
        this.$accessor.snackbar.set({
          show: true,
          message: "User Successfully Added!",
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