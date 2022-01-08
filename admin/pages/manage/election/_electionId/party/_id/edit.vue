<template>
  <span>
    <page-bars back title="Manage Party"> </page-bars>

    <manage-container>
      <template v-slot:states>
        <div v-if="$fetchState.pending">Loading...</div>
        <div v-else-if="$fetchState.error">Something went wrong</div>
      </template>
      <template v-slot:form>
        <party-edit-form
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
import partyMixins from "@/mixins/party.mixin";
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import PartyEditForm from "@/components/pages/party/forms/PartyEditForm.vue";
export default mixins(partyMixins).extend({
  components: {
    PageBars,
    ManageContainer,
    PartyEditForm,
  },
  head: {
    title: "Edit Party",
  },
  methods: {
    async update(data: any) {
      try {
        // const result = await organizationServices.update(data);
        // console.log(result);
        this.$accessor.snackbar.set({
          show: true,
          message: "Party Updated!",
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