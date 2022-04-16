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
          <template v-for="(item, i) in topItems">
            <v-list-item
              v-if="!item.sub"
              :key="i"
              :to="item.route || item.to"
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
            <v-list-group
              v-else-if="item.sub && item.sub.length"
              :value="true"
              no-action
              :key="i"
            >
              <template v-slot:activator>
                <v-list-item-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list shaped class="py-0">
                <v-list-item
                  color="primary"
                  v-for="(subitem, e) in item.sub"
                  :key="e"
                  link
                  :to="subitem.to || subitem.route"
                >
                  <v-list-item-title
                    class="pl-10"
                    v-text="subitem.title"
                  ></v-list-item-title>
                  <v-list-item-icon>
                    <v-icon>{{ subitem.icon }}</v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
            </v-list-group>
          </template>
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

    <app-dialog />

    <authentication-dialog />
  </v-app>
</template>

<script lang="ts">
import pageConfig from "~/configs/pages.config";
import AppSnackbar from "~/components/app/AppSnackbar.vue";
import AuthenticationDialog from "~/components/dialogs/AuthenticationDialog.vue";
import authMixin from "~/mixins/auth.mixins";
import mixins from "vue-typed-mixins";

export default mixins(authMixin).extend({
  components: { AppSnackbar, AuthenticationDialog },
  data() {
    return {
      clipped: true,
      drawer: false,
      topItems: [
        pageConfig.dashboard().this(),

        { ...pageConfig.admin().this(), sub: [pageConfig.users().this()] },
        pageConfig.settings().this(),
      ] as any[],

      miniVariant: false,
      title: "TUP Voting System",
    };
  },
});
</script>
