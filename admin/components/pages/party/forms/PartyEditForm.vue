<template>
  <v-form ref="form" v-model="valid">
    <v-row>
      <v-col v-if="alert.show" cols="12">
        <v-alert :type="alert.type">
          {{ alert.message }}
        </v-alert>
      </v-col>
    

      <v-col align="center" cols="12">
          <v-container class="partylist-header">
            <v-btn plain :color="background" class="cover-uploader">
            <v-img max-height="120%"
            src="https://picsum.photos/id/11/500/300"
            ></v-img>
          </v-btn>
          </v-container>
        </v-col>
        <v-col align="center" cols="12">
            <v-avatar :color="background" size="140" class="logo-uploader">
                <template v-if="!parsedUrl"> Logo Here </template>
                <template v-else>
                <v-img :src="parsedUrl"></v-img>
                </template>

                <input
                type="file"
                class="logo-uploader__input"
                accept="image/*"
                @change="onFileChange"
                />
            </v-avatar>
        </v-col>

      <v-col cols="12">
        <v-text-field
          label="Title *"
          outlined
          v-model="form.partyName"
          :rules="rules.partyName"
          hide-details="auto"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field
          label="Alias/Ticker *"
          outlined
          v-model="form.ticker"
          :rules="rules.ticker"
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
  partyName: "",
  ticker: "",
  description: "",
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
      parsedUrl: null,
    };
  },

  watch: {
    url: {
      immediate: true,
      handler: function (value, oldVal) {
        this.parsedUrl = value;
      },
    },
  },

  computed: {
    rules: function (): any {
      return {
        partyName: [(v: any) => !!v || "Username is required"],
        ticker: [(v: any) => !!v || "Alias/Ticker is required"],
        description: [(v: any) => !!v || "Description is required"],
      };
    },

    background() {
      return !this.parsedUrl ? "grey white--text" : "";
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
    onFileChange(events) {
      const files = events.target.files;

      if (files && files.length) {
        const file = files[0];
        this.parsedUrl = URL.createObjectURL(file);
        this.$emit("input", file);
      }
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

<style lang="scss">
.logo-uploader {
  &__input {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: block;
    opacity: 0;
    cursor: pointer;
  }
}
.partylist-header {
  padding-top: 40mm;
}
</style>
