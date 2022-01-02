<template>
  <span>
    <page-bars title="Voters">
      <v-btn color="primary" class="mr-2 ml-auto" outlined large
        >Import Voters</v-btn
      >
      <v-btn color="primary" class="mr-2" large>Add Voters</v-btn>
    </page-bars>

    <v-container> </v-container>
  </span>
</template>

<script>
import PageBars from "~/components/bars/PageBars.vue";
export default {
  components: { PageBars },
};
</script>

<style>
</style>