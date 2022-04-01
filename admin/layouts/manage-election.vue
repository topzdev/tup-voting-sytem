<template>
  <v-app>
    <!-- App Sidebar Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      app
    >
      <div class="d-flex flex-column" style="height: 100%">
        <v-list>
          <v-list-item
            v-for="(item, i) in sidebarLinks"
            color="primary"
            :key="i"
            :to="item.to"
            router
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
      <template v-slot:append>
        <v-divider></v-divider>
        <div class="pa-2">
          <election-dates />
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      color="primary"
      dark
      elevation="0"
    >
      <div v-if="electionInfo" class="d-flex align-center">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn fab text v-bind="attrs" @click="backToPage" v-on="on">
              <v-icon large> mdi-chevron-left </v-icon></v-btn
            >
          </template>
          <span>Back to Organization Elections</span>
        </v-tooltip>

        <v-avatar size="45" class="mr-2">
          <app-image :size="45" :src="electionInfo.logo"></app-image>
        </v-avatar>

        <v-toolbar-title class="text-capitalize">
          {{ appBarTitle }}
          <publicity-icon :size="20" :value="electionInfo.is_public" />
        </v-toolbar-title>

        <election-status-chip
          :status="electionInfo.final_status"
          class="ml-2"
        />
      </div>
      <v-spacer />
      <election-clock />
    </v-app-bar>

    <!-- App Main -->
    <v-main>
      <Nuxt />
    </v-main>

    <app-snackbar />

    <app-dialog />

    <election-information-dialog />
  </v-app>
</template>

<script lang="ts">
import pageConfig from "@/configs/pages.config";
import AppSnackbar from "~/components/app/AppSnackbar.vue";
import AppDialog from "@/components/app/AppDialog.vue";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import AppImage from "~/components/app/AppImage.vue";
import ElectionStatusChip from "~/components/chips/ElectionStatusChip.vue";
import ElectionClock from "@/components/utils/ElectionClock.vue";
import ElectionDates from "@/components/utils/ElectionDates.vue";
import ElectionInformationDialog from "@/components/utils/ElectionInformationDialog.vue";
import PublicityIcon from "~/components/icon/PublicityIcon.vue";

import mixins from "vue-typed-mixins";

export default mixins(manageElectionMixins).extend({
  components: {
    AppSnackbar,
    AppImage,
    ElectionStatusChip,
    AppDialog,
    ElectionClock,
    ElectionDates,
    ElectionInformationDialog,
    PublicityIcon,
  },
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      miniVariant: false,
    };
  },

  computed: {
    appBarTitle() {
      if (!this.electionInfo) return "Manage Election";

      const electionTitle = this.electionInfo.title;

      return electionTitle.includes("Election")
        ? `${electionTitle}`
        : `${electionTitle} Election`;
    },
  },

  methods: {
    backToPage() {
      if (!this.electionInfo) return this.$router.back();

      const orgElectionPath = `/organization/${this.electionInfo.organization_id}`;

      this.$router.push(orgElectionPath);
    },
  },
});
</script>

