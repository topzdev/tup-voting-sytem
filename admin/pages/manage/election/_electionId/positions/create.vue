<template>
  <span>
    <page-bars title="Create Position" back> </page-bars>
    <manage-container>
      <template v-slot:form>
        <position-create-form :createFunc="create" />
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
import positionServices from "@/services/position.service";
import manageElectionMixins from "@/mixins/manage-election.mixins";
export default mixins(positionMixins, manageElectionMixins).extend({
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
      if (!this.electionId) return;

      const result = await positionServices.create({
        election_id: this.electionId,
        ...data,
      });
      // console.log(result);
      this.$accessor.snackbar.set({
        show: true,
        message: "Position Added",
        timeout: 5000,
        color: "success",
      });
      this.$router.back();
    },
  },
});
</script>

<style>
</style>