<template>
  <v-app>
    <v-app-bar :clipped-left="clipped" fixed app color="primary" dark>
      <nuxt-link
        class="d-flex align-center white--text text-decoration-none"
        to="/"
      >
        <v-avatar size="45" class="mr-2">
          <app-image :size="45" :src="logo"></app-image>
        </v-avatar>
        <v-toolbar-title v-text="title" />
      </nuxt-link>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>

    <v-footer class="mt-10" color="primary" padless>
      <v-row justify="center" no-gutters>
        <v-btn
          v-for="link in footerLinks"
          :key="link.title"
          color="white"
          text
          rounded
          :to="link.to"
          class="my-2 mx-2"
        >
          {{ link.title }}
        </v-btn>
        <v-col class="primary py-2 text-center white--text" cols="12">
          © {{ new Date().getFullYear() }} Technological University of the
          Philippines - Manila Voting System. All rights reserved
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import pageRoutes from "~/configs/page-routes";
export default {
  data() {
    return {
      clipped: true,
      drawer: false,
      topItems: [
        {
          icon: "mdi-apps",
          title: "Dashboard",
          to: "/",
        },
        {
          icon: "mdi-users",
          title: "Users",
          to: "/settings/user",
        },
      ],
      logo: require("~/static/logo.png"),
      miniVariant: false,
      title: "TUP Voting System",
    };
  },

  computed: {
    footerLinks(): any[] {
      return [
        {
          title: "Home",
          to: pageRoutes.homepage().this().route,
        },
        {
          title: "Privacy Policy",
          to: pageRoutes.privacyPolicy().this().route,
        },
      ];
    },
  },
};
</script>
