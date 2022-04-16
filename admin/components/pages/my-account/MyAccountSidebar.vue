<template>
  <v-card flat width="300" outlined>
    <v-list>
      <v-list-item-group color="primary">
        <v-list-item
          v-for="(item, i) in links"
          :key="i"
          :to="item.to || item.route"
          link
          exact
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
import myAccountMixin from "@/mixins/my-account.mixins";
import { SettingLink } from "@/mixins/settings.mixin";
import mixins from "vue-typed-mixins";

export default mixins(myAccountMixin).extend({
  computed: {
    links(): SettingLink[] {
      return Object.keys(this.pages).map((item) => this.pages[item]);
    },
  },
});
</script>

<style>
</style>