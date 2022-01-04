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
        <label>Select your Organizations Elections to copy the voters </label>
        <election-picker :orgId="organizationId" :excludeId="electionId">
        </election-picker>
      </v-col>

      <v-col cols="12" class="d-flex px-0 pb-0">
        <v-btn color="blue darken-1" text @click="cancel"> Back </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="submit"> Submit </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import ElectionPicker from "@/components/pickers/ElectionPicker.vue";
import manageElectionMixins from "../../../../mixins/manage-election.mixins";

const defaultForm = {
  file: null as File[] | null,
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default manageElectionMixins.extend({
  props: {
    submitFunc: Function,
    cancelFunc: Function,
  },

  components: {
    ElectionPicker,
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