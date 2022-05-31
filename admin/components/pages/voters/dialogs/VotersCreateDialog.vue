<template>
  <v-row justify="center">
    <v-dialog v-model="isOpenLocal" persistent max-width="600px">
      <v-card :loading="loading">
        <v-card-title class="mb-4">
          <span class="text-h5">Add Voter</span>
        </v-card-title>

        <v-card-text>
          <voters-create-form
            :isModal="true"
            :cancelFunc="cancelFunc"
            :submitFunc="submitFunc"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import votersServices from "@/services/voters.service";
import VotersCreateForm from "../forms/VotersCreateForm.vue";
import mixins from "vue-typed-mixins";
import votersMixin from "../../../../mixins/voters.mixin";

export default mixins(manageElectionMixins, votersMixin).extend({
  props: {
    isOpen: Boolean,
  },

  components: {
    VotersCreateForm,
  },

  data() {
    return {
      loading: false,
      isOpenLocal: this.isOpen,
    };
  },

  computed: {},

  watch: {
    isOpen(value) {
      this.isOpenLocal = value;
    },
    isOpenLocal(value) {
      if (!value) {
        this.$router.back();
      }
      this.$emit("update:isOpen", value);
    },
  },

  methods: {
    cancelFunc() {
      this.isOpenLocal = false;
    },

    async submitFunc(body: any) {
      this.loading = true;

      try {
        const result = await votersServices.create({
          ...body,
          election_id: this.electionId,
        });
        this.$accessor.snackbar.set({
          show: true,
          message: "Voter Successfully Added!",
          timeout: 5000,
          color: "success",
        });

        this.isOpenLocal = false;

        this.refreshTable();
      } catch (error: any) {
        throw error.response.data.error;
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>