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
    </page-bars>

    <v-container>
      <voters-table />
    </v-container>

    <nuxt-child />
  </span>
</template>

<script>
import PageBars from "~/components/bars/PageBars.vue";
import VotersTable from "~/components/pages/voters/tables/VotersTable.vue";
import votersMixin from "~/mixins/voters.mixin";
export default {
  mixins: [votersMixin],
  components: { PageBars, VotersTable },
  head: {
    title: "Voters",
  },
};
</script>

<style>
</style>