<template>
  <v-app dark>
    <v-main>
      <v-container>
        <page-center class="flex-column">
          <h1 class="text-h1 font-weight-medium deep-purple--text">
            {{ statusCode }}
          </h1>
          <h2 v-html="message" class="headline text-center"></h2>
          <v-btn to="/" class="mt-2" text color="primary">
            Back to Dashboard
          </v-btn>
        </page-center>
      </v-container>
    </v-main>
  </v-app>
</template>
<script lang="ts">
import Vue, { PropOptions } from "vue";
import { NuxtError } from "@nuxt/types";
import PageCenter from "~/components/utils/PageCenter.vue";

export default Vue.extend({
  components: { PageCenter },
  props: {
    error: {
      type: Object,
      default: null,
    } as PropOptions<NuxtError>,
  },

  head() {
    return {
      title: `${this.statusCode} - ${this.message}`,
    };
  },

  computed: {
    statusCode(): number {
      return (this.error && this.error.statusCode) || 500;
    },
    message(): string {
      return this.error.message || "Something went wrong";
    },
  },
});
</script>


