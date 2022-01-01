<template>
  <span>
    <v-icon size="100">{{ thisPageConfig.icon }}</v-icon>
    <h1 class="display-2">No Election Yet</h1>
    <p class="mt-3 mx-auto body-1" style="width: 75%">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos aperiam amet
      autem sed facilis deserunt corrupti aliquid odit dolorem, provident
    </p>
    <v-btn
      color="primary"
      large
      width="75%"
      class="mt-1 mx-auto"
      :to="createPage"
      >Create Election</v-btn
    >
  </span>
</template>
<script lang="ts">
import Vue from "vue";
import pageConfig from "@/configs/pages.config";
import orgMixins from "../../../mixins/org.mixins";
export default Vue.extend({
  mixins: [orgMixins],

  computed: {
    thisPageConfig() {
      return pageConfig.election;
    },
  },
});
</script>

<style>
</style>