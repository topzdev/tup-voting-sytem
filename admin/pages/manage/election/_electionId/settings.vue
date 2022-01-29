<template>
  <span>
    <page-bars title="Election Settings"> </page-bars>

    <v-container>
      <v-row>
        <v-col class="shrink">
          <settings-sidebar />
        </v-col>
        <v-col class="grow">
          <nuxt-child />
        </v-col>
      </v-row>
    </v-container>
  </span>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import manageElectionMixins from "~/mixins/manage-election.mixins";
import settingsMixin from "~/mixins/settings.mixin";
import SettingsSidebar from "@/components/pages/settings/SettingsSidebar.vue";
export default mixins(settingsMixin).extend({
  components: { PageBars, SettingsSidebar },
  head: {
    title: "Election Settings",
  },
});
</script>

<style>
</style>