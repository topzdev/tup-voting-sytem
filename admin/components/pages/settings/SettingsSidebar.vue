<template>
  <v-card flat width="300" outlined>
    <v-list>
      <v-list-item-group color="primary">
        <v-list-item
          v-for="(item, i) in links"
          :key="i"
          :to="item.to"
          link
          replace
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { RouteConfig } from "@nuxt/types/config/router";
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import { statusOnlyAllowed } from "@/helpers/isAllowedByStatus.helper";
import settingsMixin, { SettingLink } from "@/mixins/settings.mixin";

export default mixins(settingsMixin).extend({
  computed: {
    links(): SettingLink[] {
      return Object.keys(this.pages)
        .map((item) => this.pages[item])
        .filter((item) => {
          if (!this.electionStatus || !item.status) return item;

          if (statusOnlyAllowed(this.electionStatus, item.status)) return item;
        });
    },
  },
});
</script>

<style>
</style>