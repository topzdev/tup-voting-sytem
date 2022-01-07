<template>
  <span>
    <page-bars title="Create Sample" back> </page-bars>
    <manage-container>
      <template v-slot:form>
        <sample-create-form />
      </template>
    </manage-container>
  </span>
</template>


<script lang="ts">
import ManageContainer from "@/components/containers/ManageContainer.vue";
import sampleMixins from "@/mixins/sample.mixin";
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import SampleCreateForm from "@/components/pages/sample/forms/SampleCreateForm.vue";
export default mixins(sampleMixins).extend({
  components: {
    PageBars,
    ManageContainer,
    SampleCreateForm,
  },
  head: {
    title: "Create Sample",
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