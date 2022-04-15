<template>
  <span>
    <general-edit-card />
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import GeneralEditCard from "~/components/pages/users/cards/GeneralEditCard.vue";

export default Vue.extend({
  components: { GeneralEditCard },
});
</script>

<style>
</style>