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
  </v-app>
</template>

<script>
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
};
</script>
