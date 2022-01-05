<template>
  <span>
    <page-bars back title="Manage Position"> </page-bars>

    <manage-container>
      <template v-slot:states>
        <div v-if="$fetchState.pending">Loading...</div>
        <div v-else-if="$fetchState.error">Something went wrong</div>
      </template>
      <template v-slot:form>
        <position-edit-form
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
import positionMixins from "@/mixins/position.mixins";
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import PositionEditForm from "@/components/pages/positions/forms/PositionEditForm.vue";
export default mixins(positionMixins).extend({
  components: {
    PageBars,
    ManageContainer,
    PositionEditForm,
  },
  head: {
    title: "Create Position",
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
        title: "President",
        description: "Hello, World",
        max_vote: 1,
        min_vote: 1,
      };
    } catch (error) {
      console.log(error);
    }
  },
});
</script>

<style>
</style>