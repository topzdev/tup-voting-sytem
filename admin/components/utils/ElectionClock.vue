<template>
  <no-ssr>
    <!-- <vue-awesome-countdown :end-time="new Date().getTime() + 60000">
      <span slot="process" slot-scope="{ timeObj }">{{
        `Lefttime: ${timeObj.m}:${timeObj.s}`
      }}</span>
      <span slot="finish">Done!</span>
    </vue-awesome-countdown> -->
  </no-ssr>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "../../mixins/manage-election.mixins";
export default mixins(manageElectionMixins).extend({
  data() {
    return {
      startTime: 0,
      endTime: 0,
    };
  },
});
</script>

<style>
</style>