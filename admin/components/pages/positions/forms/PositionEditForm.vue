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

      <v-col cols="6">
        <v-text-field
          label="Max Vote*"
          outlined
          v-model="form.max_vote"
          :rules="rules.max_vote"
          hide-details="auto"
        ></v-text-field>
      </v-col>

      <v-col cols="6">
        <v-text-field
          label="Max Vote*"
          outlined
          v-model="form.min_vote"
          :rules="rules.min_vote"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col class="d-flex" cols="12">
        <v-btn
          color="primary"
          :disabled="loading"
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

const defaultForm = {
  title: "",
  description: "",
  max_vote: 1,
  min_vote: 1,
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default Vue.extend({
  props: {
    defaultData: Object,
    updateFunc: Function,
  },
  data() {
    return {
      valid: false,
      alert: Object.assign({}, defaultAlert),
      loading: false,
      form: Object.assign({}, defaultForm),
      photoData: null,
    };
  },

  computed: {
    rules: function (): object {
      return {
        title: [(v: any) => !!v || "Title is required"],
        description: [(v: any) => !!v || "Start Date is required"],
        max_vote: [(v: any) => !!v || "Max Vote is required"],
        min_vote: [(v: any) => !!v || "Min Vote is required"],
      };
    },
  },

  methods: {
    async submit() {
      this.loading = true;

      (this.$refs.form as any).validate();

      if (this.valid) {
        try {
          await this.updateFunc({
            ...this.form,
            logo: this.photoData,
            id: this.defaultData.id,
          });
          this.reset();
        } catch (error: any) {
          console.log(error);
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

  watch: {
    defaultData: {
      deep: true,
      immediate: true,
      handler: function (value, oldVal) {
        const theme = value.theme;

        delete value.theme;

        this.form = Object.assign({}, value);
      },
    },
  },
});
</script>

