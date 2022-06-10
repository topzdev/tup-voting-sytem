<template>
  <v-menu offset-y bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        large
        class="text-capitalize"
        color="primary"
        dark
        v-bind="attrs"
        v-on="on"
        depressed
      >
        <v-avatar color="teal" size="30" class="mr-1">
          {{ initials }}
        </v-avatar>
        {{ fullname }}
      </v-btn>
    </template>

    <v-list>
      <v-list-item :to="myAccountRoute">
        <v-list-item-title>My Account</v-list-item-title>
      </v-list-item>
      <v-list-item color="error" @click="logout()">
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import authMixin from "@/mixins/auth.mixins";
import pageConfig from "../../configs/pages.config";

export default mixins(authMixin).extend({
  computed: {
    myAccountRoute(): string {
      return pageConfig.myaccount().this().route;
    },
  },
});
</script>

<style>
</style>