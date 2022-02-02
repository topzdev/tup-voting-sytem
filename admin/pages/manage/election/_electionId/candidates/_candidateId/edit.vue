<template>
  <span>
    <page-bars back title="Manage Candidate">
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
        <candidate-edit-form
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
import CandidateEditForm from "~/components/pages/candidate/forms/CandidateEditForm.vue";
import candidateServices from "@/services/candidate.service";
import candidateMixin from "@/mixins/candidate.mixin";
import pageStatus from "@/configs/page-status.config";
export default mixins(candidateMixin).extend({
  meta: {
    status: pageStatus.candidate.edit,
  },
  components: {
    PageBars,
    ManageContainer,
    CandidateEditForm,
  },
  head: {
    title: "Update Candidate",
  },
  methods: {
    async remove() {
      if (!this.candidateId) return;
      const result = await candidateServices.delete(parseInt(this.candidateId));

      this.$accessor.snackbar.set({
        show: true,
        message: "Candidate Deleted",
        timeout: 5000,
        color: "success",
      });
      this.$router.back();
    },

    async update(data: any) {
      const result = await candidateServices.update({
        ...data,
        id: this.candidateId,
      });
      console.log(result);
      this.$accessor.snackbar.set({
        show: true,
        message: "Candidate Updated!",
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
    candidateId() {
      const id = this.$route.params.candidateId;
      if (!id) throw Error("Candidate ID is missing :(");
      return this.$route.params.candidateId;
    },
  },

  fetchOnServer: false,
  async fetch() {
    try {
      this.defaultData = await candidateServices.getById(this.candidateId);
    } catch (error) {
      console.log(error);
    }
  },
});
</script>

<style>
</style>