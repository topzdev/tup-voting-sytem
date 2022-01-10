<template>
  <v-form ref="form" v-model="valid">
    <v-row>
      <v-col v-if="alert.show" cols="12">
        <v-alert :type="alert.type">
          {{ alert.message }}
        </v-alert>
      </v-col>

      <v-col cols="12">
        <v-text-field
          label="Title *"
          outlined
          v-model="form.title"
          :rules="rules.title"
          hide-details="auto"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field
          label="Description *"
          outlined
          v-model="form.description"
          :rules="rules.description"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="6">
            <v-text-field
              type="number"
              label="Maximum*"
              outlined
              v-model.number="form.max_selected"
              :rules="rules.max_selected"
              hide-details="auto"
              @keypress="shouldNumber"
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <v-text-field
              type="number"
              label="Minimum*"
              outlined
              v-model.number="form.min_selected"
              :rules="rules.min_selected"
              hide-details="auto"
              @keypress="shouldNumber($event)"
            ></v-text-field> </v-col
          ><v-col class="d-flex pt-0" cols="12">
            <label class="subtitle-2" for=""
              >Voters Can Select Maximum of {{ form.max_selected }} and a
              minimum {{ form.min_selected }} candidate(s) option
            </label>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="d-flex" cols="12">
        <v-btn
          color="primary"
          :disabled="!valid || loading"
          :loading="loading"
          large
          block
          @click="submit"
          >Save</v-btn
        >
      </v-col>
    </v-row>
  </v-form>
</template>


<script lang="ts">
import Vue, { PropOptions } from "vue";
import configs from "@/configs";
import mixins from "vue-typed-mixins";
import positionFormMixin from "@/mixins/forms/position-form.mixins";
import debounce from "debounce";

export default mixins(positionFormMixin).extend({
  props: {
    defaultData: Object,
    updateFunc: Function,
  },

  methods: {
    async submit() {
      this.loading = true;

      (this.$refs.form as any).validate();

      if (this.valid) {
        try {
          await this.updateFunc(this.form);
          this.reset();
        } catch (error: any) {
          if (error) {
            const message =
              error.response?.data?.error?.message || error.message;

            console.error(message);

            this.alert = {
              show: true,
              type: "error",
              message,
            };
          }
        }
      }
      this.loading = false;
    },
  },

  watch: {
    ["form"]: {
      deep: true,
      immediate: true,
      handler: debounce(function (newVal: any, oldVal: any) {
        // @ts-ignore
        this.isEdited =
          // @ts-ignore
          JSON.stringify(this.defaultData) !== JSON.stringify(newVal);
      }, 250),
    },

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

