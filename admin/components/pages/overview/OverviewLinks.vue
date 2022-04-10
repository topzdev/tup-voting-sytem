<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="1">
        <v-card-title class="title py-2">Election Links</v-card-title>
        <v-divider></v-divider>

        <v-card-subtitle>
          The links below will not be accessible until after the election has
          been launched.</v-card-subtitle
        >

        <v-card-text class="body-1">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Voting Link"
                outlined
                readonly
                :value="longUrl"
                :append-icon="icons.clipboard"
                @click:append="copyClipboard(longUrl)"
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="Voting Short Link"
                outlined
                readonly
                :value="shortUrl"
                :append-icon="icons.clipboard"
                @click:append="copyClipboard(longUrl)"
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <v-col cols="12" v-if="preRegisterUrl">
              <v-text-field
                label="Pre-Registration Link"
                outlined
                readonly
                :value="preRegisterUrl"
                :append-icon="icons.clipboard"
                @click:append="copyClipboard(preRegisterUrl)"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import configs from "@/configs";
import { OverviewUrls } from "@/services/overview.service";
import icons from "@/configs/icons";
export default Vue.extend({
  props: {
    urls: {
      type: Object,
    } as PropOptions<OverviewUrls | null>,
  },

  data() {
    return {
      icons,
    };
  },

  computed: {
    longUrl(): string {
      if (!this.urls) return "";
      return this.urls.longUrl;
    },
    shortUrl(): string {
      if (!this.urls) return "";
      return this.urls.shortUrl;
    },
    preRegisterUrl(): string {
      if (!this.urls) return "";
      return this.urls.preRegisterUrl;
    },
  },

  methods: {
    copyClipboard(url: string) {
      const self = this;

      navigator.clipboard.writeText(url).then(function () {
        self.$accessor.snackbar.show({
          show: true,
          message: "Link copied to clipboard",
          color: "info",
          timeout: 2000,
        });
      });
    },
  },
});
</script>

<style>
</style>