<template>
  <v-card>
    <v-card-title> Archive Election </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-row>
          <v-col v-if="alert.show" cols="12">
            <v-alert :type="alert.type">
              {{ alert.message }}
            </v-alert>
          </v-col>
          <v-col>
            <p class="body-1 mb-0">
              Archiving the election will hide it from your organization's
              landing page
            </p>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="warning"
        :disabled="loading"
        :loading="loading"
        large
        @click="submit"
        >Archive Election</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import configs from "@/configs";

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default Vue.extend({
  data() {
    return {
      valid: false,
      alert: Object.assign({}, defaultAlert),
      loading: false,
      photoData: null,

      baseURL: configs.baseURL,
    };
  },

  methods: {
    async submit() {
      this.loading = true;

      (this.$refs.form as any).validate();

      if (this.valid) {
        try {
        } catch (error: any) {
          if (error) {
            this.alert = {
              show: true,
              type: "error",
              message: error.message,
            };
          }
        }
      }
      this.loading = false;
    },

    reset() {
      (this.$refs as any).form.reset();
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },
  },
});
</script>