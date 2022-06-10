<template>
  <div v-if="$fetchState.pending">
    <page-center>
      <app-loading />
    </page-center>
  </div>
  <div v-else-if="$fetchState.error">Something went wrong</div>
  <nuxt-child v-else />
</template>


<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import themeMixin from "~/mixins/theme.mixin";
import { Organization } from "@/services/organization.service";
import PageCenter from "@/components/utils/PageCenter.vue";
import pageConfig from "../../../configs/pages.config";
export default mixins(themeMixin).extend({
  auth: true,
  layout: "manage-election",
  middleware: ["status", "roles"],

  components: {
    PageCenter,
  },

  watch: {
    organization: {
      immediate: true,
      handler: function (value) {
        this.updateTheme();
      },
    },
  },
  fetchOnServer: false,

  validate({ $auth, redirect, params }) {
    const election_id = params.electionId;

    console.log(election_id);

    const user = $auth.user;
    if (user.election_officer) {
      if (user.election_officer.election_id !== parseInt(election_id)) {
        redirect(
          pageConfig.election(user.election_officer.election_id).this().route
        );
      }
    }

    return true;
  },

  methods: {
    updateTheme() {
      if (!this.organization) return;
      this.changeTheme(this.organization.theme);
    },
  },

  computed: {
    organization(): Organization | null {
      return this.$accessor.manageElection.organization;
    },
  },

  async fetch() {
    const id = this.$route.params.electionId;
    await this.$accessor.manageElection.fetchElection(parseInt(id));
    this.updateTheme();
  },

  mounted() {
    this.updateTheme();
  },

  destroyed() {
    this.changeTheme();
  },
});
</script>


<style>
</style>