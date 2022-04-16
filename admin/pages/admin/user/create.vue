<template>
  <span>
    <page-bars back title="Create User"> </page-bars>

    <v-container>
      <v-row>
        <v-col cols="5" class="mx-auto">
          <v-card flat>
            <v-card-text>
              <user-create-form
                :cancelFunc="cancelFunc"
                :submitFunc="submitFunc"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </span>
</template>


<script lang="ts">
import userServices from "@/services/user.service";
import PageBars from "@/components/bars/PageBars.vue";
import UserCreateForm from "@/components/pages/users/forms/UserCreateForm.vue";
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  components: { UserCreateForm, PageBars },

  props: {
    isOpen: Boolean,
    fetchFunc: Function,
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

<style>
</style>