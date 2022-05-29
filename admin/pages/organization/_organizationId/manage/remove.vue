<template>
  <span>
    <delete-organization-card />
  </span>
</template>

<script lang="ts">
import DeleteOrganizationCard from "~/components/pages/org/cards/DeleteOrganizationCard.vue";
import mixins from "vue-typed-mixins";
export default mixins().extend({
  components: { DeleteOrganizationCard },
});
</script>

