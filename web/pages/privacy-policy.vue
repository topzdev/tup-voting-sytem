<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="6" class="mx-auto">
        <h1 class="text-center my-10" v-text="privacyPolicy.title"></h1>
        <p class="text--secondary">{{ privacyPolicy.lastUpdate }}</p>
        <span v-html="privacyPolicy.content"></span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import dayjs from "dayjs";
import Vue, { PropOptions } from "vue";
import { MetaInfo } from "vue-meta";
import configs from "@/configs";
export default Vue.extend({
  head(): MetaInfo {
    return {
      title: `Privacy Policy`,

      meta: [
        {
          name: "description",
          hid: "description",
          content: "tupvote.com Privacy Policy",
        },
      ],
    };
  },

  computed: {
    privacyPolicy(): any {
      return {
        title: `Privacy Policy`,
        lastUpdate:
          "Last Update: " +
          dayjs(
            "Tue Jun 21 2022 20:20:45 GMT+0800 (Philippine Standard Time)"
          ).format("MMMM DD, YYYY"),

        content: configs.privacy_policy,
      };
    },
  },
});
</script>

<style>
</style>