<template>
  <span>
    <election-officer-card />
  </span>
</template>

<script lang="ts">
import ElectionOfficerCard from "~/components/pages/org/cards/ElectionOfficerCard.vue";
import mixins from "vue-typed-mixins";
export default mixins().extend({
  components: { ElectionOfficerCard },
});
</script>

