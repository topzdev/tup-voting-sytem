<template>
  <v-dialog v-model="dialog" width="1000">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        fab
        color="primary"
        :right="true"
        :bottom="true"
        fixed
        dark
        v-bind="attrs"
        v-on="on"
        large
      >
        <v-icon>mdi-presentation-play</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title> How to use the system </v-card-title>

      <v-card-text>
        <iframe
          v-if="dialog"
          frameBorder="0"
          width="950"
          height="600"
          src="https://www.youtube.com/embed/AvLCRiYRwek"
        >
        </iframe>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  data() {
    return {
      dialog: false,
    };
  },
});
</script>

<style>
</style>