<template>
  <span>
    <terms-and-condition-card />
  </span>
</template>

<script lang="ts">
import TermsAndConditionCard from "~/components/pages/org/cards/TermsAndConditionCard.vue";
import mixins from "vue-typed-mixins";
export default mixins().extend({
  components: { TermsAndConditionCard },
});
</script>

