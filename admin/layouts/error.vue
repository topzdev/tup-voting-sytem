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
    } as PropOptions<any>,
  },

  head(): any {
    const title = this.titlePage;
    return {
      // @ts-ignore
      title,
    };
  },

  computed: {
    statusCode(): number {
      return (this.error && this.error.statusCode) || 500;
    },
    message(): string {
      const message =
        this.error.response?.data?.error?.message || this.error.message;

      return message || "Something went wrong";
    },
    titlePage(): string {
      return `${this.statusCode} - ${this.message}`;
    },
  },
});
</script>


