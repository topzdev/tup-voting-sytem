<template>
  <page-center>
    <v-row>
      <v-col class="mx-auto text-center" md="4">
      <h1>Partylist</h1>
      </v-col>
    </v-row>
  </page-center>
</template>

<script lang-'ts'>
import Vue, { PropOptions } from "vue";
import PageCenter from '~/components/utils/PageCenter.vue'
export default Vue.extend({
  components: { 
    PageCenter,
  },

  data() {
    return {
      loading: true,
      items: [],
      count: 0,
    };
  },

});
</script>

<style>

</style>