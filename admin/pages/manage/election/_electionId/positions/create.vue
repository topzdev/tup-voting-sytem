<template>
  <span>
    <page-bars title="Create Position" back> </page-bars>
    <manage-container>
      <template v-slot:form>
        <position-create-form />
      </template>
    </manage-container>
  </span>
</template>


<script lang="ts">
import ManageContainer from "@/components/containers/ManageContainer.vue";
import positionMixins from "@/mixins/position.mixins";
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import PositionCreateForm from "@/components/pages/positions/forms/PositionCreateForm.vue";
export default mixins(positionMixins).extend({
  components: {
    PageBars,
    ManageContainer,
    PositionCreateForm,
  },
  head: {
    title: "Create Position",
  },
  methods: {
    async create(data: any) {
      try {
        // const result = await organizationServices.create(data);
        // console.log(result);
        this.$accessor.snackbar.set({
          show: true,
          message: "Position Added!",
          timeout: 5000,
          color: "success",
        });
        this.$router.back();
      } catch (error: any) {
        throw error.response.data.error;
      }
    },
  },
});
</script>

<style>
</style>