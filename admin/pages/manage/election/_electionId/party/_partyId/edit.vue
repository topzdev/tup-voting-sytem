<template>
  <span>
    <page-bars back title="Manage Party">
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
        <div v-if="$fetchState.pending">
          <app-loading />
        </div>
        <div v-else-if="$fetchState.error">Something went wrong</div>
      </template>
      <template v-slot:centered>
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
import mixins from "vue-typed-mixins";
import PageBars from "~/components/bars/PageBars.vue";
import PartyEditForm from "~/components/pages/party/forms/PartyEditForm.vue";
import partyServices from "@/services/party.service";
import partyMixin from "@/mixins/party.mixin";
import pageStatus from "@/configs/page-status.config";

export default mixins(partyMixin).extend({
  meta: {
    status: pageStatus.party.edit,
  },

  components: {
    PageBars,
    ManageContainer,
    PartyEditForm,
  },
  head: {
    title: "Update Party",
  },
  methods: {
    async remove() {
      if (!this.partyId) return;
      const result = await partyServices.delete(parseInt(this.partyId));

      this.$accessor.snackbar.set({
        show: true,
        message: "Party Deleted",
        timeout: 5000,
        color: "success",
      });
      this.$router.back();
    },

    async update(data: any) {
      const result = await partyServices.update({
        ...data,
        id: this.partyId,
      });
      console.log(result);
      this.$accessor.snackbar.set({
        show: true,
        message: "Party Updated!",
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

  computed: {
    partyId(): string {
      const id = this.$route.params.partyId;
      if (!id) throw Error("Party ID is missing :(");
      return id;
    },
  },

  fetchOnServer: false,
  async fetch() {
    try {
      this.defaultData = await partyServices.getById(parseInt(this.partyId));
    } catch (error) {
      console.log(error);
    }
  },
});
</script>

<style>
</style>