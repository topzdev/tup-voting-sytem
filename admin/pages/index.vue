<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="logo py-4 d-flex justify-center">
        <pre>
            {{ $auth.user }}
          </pre
        >
      </v-card>
    </v-col>
  </v-row>
</template>
vue <script lang="ts">
import Vue from "vue";
export default Vue.extend({
  auth: true,
});
</script>