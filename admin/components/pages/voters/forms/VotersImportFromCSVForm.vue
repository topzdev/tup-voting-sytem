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
      <v-col cols="12">
        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="auto">
                <v-avatar color="blue" size="30" class="white--text"
                  >1</v-avatar
                >
              </v-col>

              <v-col class="px-4">
                <h3 class="text--primary mb-1">Read import instructions</h3>
                <p>
                  To get started,
                  <nuxt-link to="/instructions/import-from-csv"
                    >click here</nuxt-link
                  >
                  to read the instructions on how to import voters.
                </p>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="auto">
                <v-avatar color="blue" size="30" class="white--text"
                  >2</v-avatar
                >
              </v-col>

              <v-col class="px-4">
                <h3 class="text--primary mb-1">Download the import template</h3>
                <p class="mb-1">
                  <nuxt-link to="/instructions/import-from-csv"
                    >Click here</nuxt-link
                  >
                  to download the voter import template and add one voter per
                  row.
                </p>
                <v-alert dense text type="warning"
                  >The columns in your spreadsheet must exactly match the import
                  template or import will fail</v-alert
                >
              </v-col>
            </v-row> </v-col
          ><v-col cols="12">
            <v-row no-gutters>
              <v-col cols="auto">
                <v-avatar color="blue" size="30" class="white--text"
                  >3</v-avatar
                >
              </v-col>

              <v-col class="px-4">
                <h3 class="text--primary mb-1">
                  Select the import file from your computer
                </h3>

                <v-text-field
                  accept=".csv"
                  label="Choose File"
                  outlined
                  class="mt-3"
                  hide-details="auto"
                  type="file"
                  v-model="form.file"
                  :rules="rules.file"
                  append-icon="mdi-file"
                ></v-text-field>

                <p class="mt-2">
                  Click Upload button below to process your file.
                </p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" class="d-flex px-0 pb-0">
        <v-btn color="blue darken-1" text @click="cancel"> Back </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="submit"> Upload </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";

const defaultForm = {
  file: null as File[] | null,
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default Vue.extend({
  props: {
    submitFunc: Function,
    cancelFunc: Function,
  },

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
      return {
        file: [(v: any) => (v && v.length > 0) || "File is required"],
      };
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
      console.log(this.form.file);

      if (this.valid) {
        try {
          if (this.submitFunc) await this.submitFunc(this.form);

          alert("Uploaded");
        } catch (error: any) {
          this.alert = {
            show: true,
            type: "error",
            message: error.message,
          };
        } finally {
          this.loading = false;
        }
      }
    },
    reset() {
      (this.$refs as any).form.reset();
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },
  },
});
</script>

<style>
</style>