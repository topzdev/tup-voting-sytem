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
            <v-col cols="12" v-if="electionUrl">
              <v-text-field
                label="Election Preview"
                outlined
                readonly
                :value="electionUrl"
                :append-icon="icons.clipboard"
                @click:append="copyClipboard(electionUrl)"
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="Voting"
                outlined
                readonly
                :value="longUrl"
                :append-icon="icons.clipboard"
                @click:append="copyClipboard(longUrl)"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <!-- 
            <v-col cols="12">
              <v-text-field
                label="Voting Short Link"
                outlined
                readonly
                :value="shortUrl"
                :append-icon="icons.clipboard"
                @click:append="copyClipboard(shortUrl)"
                hide-details="auto"
              ></v-text-field>
            </v-col> -->

            <v-col cols="12" v-if="preRegisterUrl">
              <v-text-field
                label="Pre-Registration"
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
import { ElectionUrls } from "@/services/overview.service";
import icons from "@/configs/icons";
export default Vue.extend({
  props: {
    urls: {
      type: Object,
    } as PropOptions<ElectionUrls | null>,
  },

  data() {
    return {
      icons,
    };
  },

  computed: {
    longUrl(): string {
      if (!this.urls) return "";
      return this.urls.votingLongUrl;
    },
    shortUrl(): string {
      if (!this.urls) return "";
      return this.urls.votingShortUrl;
    },
    preRegisterUrl(): string {
      if (!this.urls) return "";
      return this.urls.preRegisterUrl;
    },
    electionUrl(): string | undefined {
      if (!this.urls) return "";
      return this.urls.electionUrl;
    },
  },

  methods: {
    copyClipboard(url: string | undefined) {
      const self = this;

      if (!url) return;
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