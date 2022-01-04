<template>
  <span>
    <page-bars title="Voters">
      <v-btn
        color="primary"
        class="mr-2 ml-auto"
        outlined
        large
        @click="importVoterRoute"
        >Import Voters</v-btn
      >
      <v-btn color="primary" class="mr-2" @click="createVoterRoute" large
        >Add Voters</v-btn
      >
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="exportVoters">
            <v-list-item-title>Export Voters</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </page-bars>

    <v-container>
      <voters-table />
    </v-container>

    <nuxt-child />
  </span>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import VotersTable from "~/components/pages/voters/tables/VotersTable.vue";
import manageElectionMixins from "~/mixins/manage-election.mixins";
import votersMixin from "~/mixins/voters.mixin";
import userServices from "~/services/user.service";
import votersServices from "~/services/voters.service";
import blobDownloader from "~/helpers/blob-downloader.helper";
export default mixins(votersMixin, manageElectionMixins).extend({
  components: { PageBars, VotersTable },
  head: {
    title: "Voters",
  },
  methods: {
    async exportVoters() {
      if (!this.electionId) return;

      const data = await votersServices.exportToCsv(this.electionId);

      blobDownloader(
        data,
        `${this.electionInfo?.title}-${Date.now()}`,
        `text/csv`
      );
    },
  },
});
</script>

<style>
</style>