<template>
  <span>
    <page-bars back title="Edit User"> </page-bars>

    <v-container>
      <v-row>
        <v-col class="shrink">
          <user-edit-sidebar />
        </v-col>
        <v-col cols="6" class="grow">
          <nuxt-child />
        </v-col>
      </v-row>
    </v-container>
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import PageBars from "@/components/bars/PageBars.vue";
import UserEditSidebar from "@/components/pages/users/UserEditSidebar.vue";
export default Vue.extend({
  components: {
    PageBars,
    UserEditSidebar,
  },
});
</script>

<style>
</style>