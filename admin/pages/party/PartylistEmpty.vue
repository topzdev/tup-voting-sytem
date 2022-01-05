<template>
    <v-row>
      <v-col class="mx-auto text-center" md="4">
        <v-icon size="100">{{ orgPageConfig.icon }}</v-icon>
        <h1 class="display-2">No Partylist Yet</h1>
        <p class="mt-3 mx-auto body-1" style="width: 75%">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos aperiam amet
          autem sed facilis deserunt corrupti aliquid odit dolorem, provident
        </p>
        <v-btn color="primary" large width="75%" class="mt-1 mx-auto"
          >Create Partylist</v-btn
        >
      </v-col>
    </v-row>
</template>
vue <script lang="ts">
import Vue from "vue";
import pageConfig from "@/configs/pages.config";
export default Vue.extend({
  computed: {
    orgPageConfig() {
      return pageConfig.party;
    },
  },
});
</script>

<style>
</style>