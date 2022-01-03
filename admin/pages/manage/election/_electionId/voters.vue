<template>
  <span>
    <page-bars title="Voters">
      <v-btn color="primary" class="mr-2 ml-auto" outlined large
        >Import Voters</v-btn
      >
      <v-btn color="primary" class="mr-2" large>Add Voters</v-btn>
    </page-bars>

    <v-container>
      <voters-table />
    </v-container>

    <nuxt-child />
  </span>
</template>

<script>
import PageBars from "~/components/bars/PageBars.vue";
import VotersTable from "~/components/pages/voters/VotersTable.vue";
export default {
  components: { PageBars, VotersTable },
};
</script>

<style>
</style>