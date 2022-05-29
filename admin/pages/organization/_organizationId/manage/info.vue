<template>
  <span>
    <edit-organization-card />
  </span>
</template>

<script lang="ts">
import EditOrganizationCard from "~/components/pages/org/cards/EditOrganizationCard.vue";
import mixins from "vue-typed-mixins";
export default mixins().extend({
  components: { EditOrganizationCard },
});
</script>

