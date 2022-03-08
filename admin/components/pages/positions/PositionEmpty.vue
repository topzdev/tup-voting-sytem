<template>
  <span>
    <v-icon color="primary" size="100">{{ thisPageConfig.icon }}</v-icon>
    <h1 class="display-2">No Position Yet</h1>
    <p class="mt-3 mx-auto body-1" style="width: 75%">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos aperiam amet
      autem sed facilis deserunt corrupti aliquid odit dolorem, provident
    </p>
    <v-btn
      v-if="hideByStatus(pageStatus.candidate.create)"
      color="primary"
      large
      width="75%"
      class="mt-1 mx-auto"
      :to="createPositionRoute()"
      >Create Position</v-btn
    >
  </span>
</template>
<script lang="ts">
import mixins from "vue-typed-mixins";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import positionMixins from "@/mixins/position.mixins";
import restrictionsMixin from "../../../mixins/restrictions.mixin";
export default mixins(
  manageElectionMixins,
  positionMixins,
  restrictionsMixin
).extend({
  computed: {
    thisPageConfig() {
      return this.links["positions"];
    },
  },
});
</script>

<style>
</style>