<template>
  <span>
    <page-bars back title="Manage Position">
      <v-menu offset-y min-width="200">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="ml-auto"
            color="primary"
            dark
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item color="error" class="error--text" @click="remove">
            <v-list-item-icon>
              <v-icon color="error">mdi-delete</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </page-bars>

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
import positionServices from "@/services/position.service";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import pageStatus from "@/configs/page-status.config";
export default mixins(manageElectionMixins, positionMixins).extend({
  meta: {
    status: pageStatus.positions.edit,
  },
  components: {
    PageBars,
    ManageContainer,
    PositionEditForm,
  },
  head: {
    title: "Create Position",
  },

  computed: {
    positionId() {
      const id = parseInt(this.$route.params.positionId);

      if (!id) throw Error("Position ID is required");

      return id;
    },
  },

  methods: {
    async remove() {
      if (!this.electionId) return;
      const result = await positionServices.delete(this.positionId);

      this.$accessor.snackbar.set({
        show: true,
        message: "Position Deleted",
        timeout: 5000,
        color: "success",
      });
      this.$router.back();
    },

    async update(data: any) {
      if (!this.electionId) return;

      const result = await positionServices.update({
        election_id: undefined,
        ...data,
      });
      this.$accessor.snackbar.set({
        show: true,
        message: "Position Updated",
        timeout: 5000,
        color: "success",
      });
      this.$router.back();
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
      this.defaultData = await positionServices.getById(this.positionId);
    } catch (error) {
      console.log(error);
    }
  },
});
</script>

<style>
</style>