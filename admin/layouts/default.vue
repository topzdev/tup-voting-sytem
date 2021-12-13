<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
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

        <v-list style="margin-top: auto">
          <v-list-group
            v-for="(item, i) in bottomItems"
            :key="i"
            :to="item.to"
            router
            color="primary"
            :prepend-icon="item.icon"
          >
            <template v-slot:activator>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </template>

            <v-list shaped>
              <v-list-item
                v-for="(item, i) in item.subgroups"
                :key="i"
                :to="item.to"
                link
                color="primary"
              >
                <v-list-item-title v-text="item.title" />

                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list>
          </v-list-group>
        </v-list>
      </div>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!-- <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list> </v-list>
    </v-navigation-drawer>
    <!-- <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
    <app-snackbar />
  </v-app>
</template>

<script>
import pageConfig from "@/configs/pages.config";
import AppSnackbar from "~/components/app/AppSnackbar.vue";
export default {
  components: { AppSnackbar },
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      topItems: [
        {
          icon: "mdi-apps",
          title: "Dashboard",
          to: "/",
        },

        pageConfig.org,

        {
          icon: "mdi-chart-bubble",
          title: "Inspire",
          to: "/inspire",
        },
        {
          icon: "mdi-lock",
          title: "Protected",
          to: "/protected",
        },
      ],
      bottomItems: [
        {
          icon: "mdi-cog",
          title: "Settings",
          to: "/settings",
          subgroups: [
            {
              icon: "mdi-account-supervisor",
              title: "Manage Users",
              to: "/settings/users",
            },
          ],
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "TUP Voting System",
    };
  },
};
</script>
