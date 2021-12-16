<template>
  <v-form ref="form" v-model="valid">
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

      <v-col cols="12" class="d-flex">
        <v-btn color="blue darken-1" text @click="cancel"> Close </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" :loading="loading" text @click="submit">
          Reset Password
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import PasswordField from "@/components/input/PasswordField.vue";
import configs from "@/configs";
import Vue from "vue";

const defaultForm = {};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default Vue.extend({
  props: {
    submitFunc: Function,
    cancelFunc: Function,
    isModal: Boolean,
    defaultData: Object,
  },
  components: { PasswordField },
  data() {
    return {
      valid: false,
      alert: Object.assign({}, defaultAlert),
      loading: false,
      form: Object.assign({}, defaultForm),
    };
  },

  computed: {
    rules(): any {
      return {};
    },
  },

  methods: {
    async cancel() {
      if (this.cancelFunc) this.cancelFunc();
      this.reset();
    },
    async submit() {
      this.loading = true;

      (this.$refs as any).form.validate();

      if (this.valid) {
        try {
          if (this.submitFunc) await this.submitFunc(this.form);
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

    reset() {
      (this.$refs as any).form.reset();
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },
  },
  watch: {
    defaultData: {
      deep: true,
      immediate: true,
      handler: function (value, oldVal) {
        this.form = Object.assign({}, value);
      },
    },
  },
});
</script>

<style>
</style>