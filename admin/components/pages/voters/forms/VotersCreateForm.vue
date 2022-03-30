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
      <v-col cols="6">
        <v-text-field
          label="Firstname"
          outlined
          v-model="form.firstname"
          :rules="rules.firstname"
          hide-details="auto"
        ></v-text-field>
      </v-col>

      <v-col cols="6">
        <v-text-field
          label="Lastname"
          outlined
          v-model="form.lastname"
          :rules="rules.lastname"
          hide-details="auto"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field
          label="Email Address"
          outlined
          v-model="form.email_address"
          :rules="rules.email_address"
          hide-details="auto"
        ></v-text-field>
      </v-col>

      <v-col cols="12" class="d-flex px-0 pb-0">
        <v-btn color="blue darken-1" text @click="cancel"> Close </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="submit"> Save </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import votersFormMixin from "@/mixins/forms/voters-form.mixins";

export default votersFormMixin.extend({
  props: {
    submitFunc: Function,
    cancelFunc: Function,
    isModal: Boolean,
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
        } finally {
          this.loading = false;
        }
      }
    },
  },
});
</script>

<style>
</style>