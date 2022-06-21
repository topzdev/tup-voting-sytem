<template>
  <span v-if="!$fetchState.pending">
    <page-bars back title="My Account"> </page-bars>

    <v-container v-if="!$fetchState.pending && !$fetchState.error">
      <v-row>
        <v-col class="shrink">
          <my-account-sidebar />
        </v-col>
        <v-col cols="6" class="grow">
          <nuxt-child />

          <p class="mt-2">
            <nuxt-link to="/privacy-policy" class="mr-5"
              >Privacy policy</nuxt-link
            >

            <nuxt-link to="/terms-and-condition">Terms and Condition</nuxt-link>
          </p>
        </v-col>
      </v-row>
    </v-container>
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import PageBars from "@/components/bars/PageBars.vue";
import mixins from "vue-typed-mixins";
import MyAccountSidebar from "@/components/pages/my-account/MyAccountSidebar.vue";
export default mixins().extend({
  components: {
    PageBars,
    MyAccountSidebar,
  },

  async fetch() {
    await this.$accessor.myAccount.fetchAccount();
  },
});
</script>

<style>
</style>