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
import { SettingLink } from "@/mixins/settings.mixin";
import editUserMixin from "@/mixins/edit-user";

export default mixins(editUserMixin).extend({
  computed: {
    links(): SettingLink[] {
      return Object.keys(this.pages).map((item) => this.pages[item]);
    },
  },
});
</script>

<style>
</style>