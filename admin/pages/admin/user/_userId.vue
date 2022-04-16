<template>
  <span v-if="!$fetchState.pending">
    <page-bars back title="Edit User"> </page-bars>

    <v-container v-if="!$fetchState.pending && !$fetchState.error">
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
import mixins from "vue-typed-mixins";
import editUserMixin from "../../../mixins/edit-user";
export default mixins(editUserMixin).extend({
  components: {
    PageBars,
    UserEditSidebar,
  },

  async fetch() {
    await this.$accessor.user.clearUser();
    await this.$accessor.user.fetchUser(this.userId);
  },
});
</script>

<style>
</style>