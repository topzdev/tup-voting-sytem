<template></template>

<script lang="ts">
import Vue from "vue";
import mixins from "vue-typed-mixins";
import settingsMixin from "../../../../../mixins/settings.mixin";
export default mixins(settingsMixin).extend({
  created() {
    // this.$router.push(this.generalRoute());
  },
});
</script>

<style>
</style>