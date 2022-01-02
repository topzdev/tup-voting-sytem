<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      absolute
      temporary
      app
    >
      <div class="d-flex flex-column" style="height: 100%">
        <v-list>
          <v-list-item
            v-for="(item, i) in topItems"
            :key="i"
            :to="item.to"
            router
            color="primary"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-toolbar-title v-text="title" />
      <v-spacer />

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
          <v-list-item @click="logout()">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>

    <app-snackbar />
  </v-app>
</template>

<script>
import pageConfig from "@/configs/pages.config";
import AppSnackbar from "~/components/app/AppSnackbar.vue";
import authMixin from "~/mixins/auth.mixins";
export default {
  components: { AppSnackbar },
  mixins: [authMixin],
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
      ],

      miniVariant: false,
      title: "TUP Voting System",
    };
  },
};
</script>
