<template>
  <span>
    <page-bars back title="Manage Sample"> </page-bars>

    <manage-container>
      <template v-slot:states>
        <div v-if="$fetchState.pending">Loading...</div>
        <div v-else-if="$fetchState.error">Something went wrong</div>
      </template>
      <template v-slot:form>
        <sample-edit-form
          v-if="!$fetchState.error && !$fetchState.pending"
          :defaultData="defaultData"
          :updateFunc="update"
        />
      </template>
    </manage-container>
  </span>
</template>

<script lang="ts">
import ManageContainer from "@/components/containers/ManageContainer.vue";
import sampleMixins from "@/mixins/sample.mixin";
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import SampleEditForm from "@/components/pages/sample/forms/SampleEditForm.vue";
export default mixins(sampleMixins).extend({
  components: {
    PageBars,
    ManageContainer,
    SampleEditForm,
  },
  head: {
    title: "Create Sample",
  },
  methods: {
    async update(data: any) {
      try {
        // const result = await organizationServices.update(data);
        // console.log(result);
        this.$accessor.snackbar.set({
          show: true,
          message: "Position Updated!",
          timeout: 5000,
          color: "success",
        });
        this.$router.back();
      } catch (error: any) {
        throw error.response.data.error;
      }
    },
  },
  data() {
    return {
      defaultData: null as any,
    };
  },

  fetchOnServer: false,
  async fetch() {
    try {
      this.defaultData = {
        id: 1,
        username: "topzdev",
        description: "Test 1",
      };
    } catch (error) {
      console.log(error);
    }
  },
});
</script>

<style>
</style>