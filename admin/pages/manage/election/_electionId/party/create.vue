<template>
  <span>
    <page-bars title="Create Party" back> </page-bars>
    <manage-container>
      <template v-slot:form>
        <party-create-form />
      </template>
    </manage-container>
  </span>
</template>


<script lang="ts">
import ManageContainer from "@/components/containers/ManageContainer.vue";
import partyMixins from "@/mixins/party.mixin";
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import PartyCreateForm from "@/components/pages/party/forms/PartyCreateForm.vue";
export default mixins(partyMixins).extend({
  components: {
    PageBars,
    ManageContainer,
    PartyCreateForm,
  },
  head: {
    title: "Create Party",
  },
  methods: {
    async create(data: any) {
      try {
        // const result = await organizationServices.create(data);
        // console.log(result);
        this.$accessor.snackbar.set({
          show: true,
          message: "Party Added!",
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