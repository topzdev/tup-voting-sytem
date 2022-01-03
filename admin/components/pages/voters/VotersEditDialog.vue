<template>
  <v-row justify="center">
    <v-dialog v-model="isOpenLocal" persistent width="600px" max-width="600px">
      <v-card :loading="$fetchState.pending">
        <v-card-title class="mb-4">
          <span class="text-h5">Edit Voters</span>
        </v-card-title>

        <v-card-text v-if="!$fetchState.pending && !$fetchState.error">
          <voters-edit-form
            :isModal="true"
            :cancelFunc="cancelFunc"
            :submitFunc="submitFunc"
            :defaultData="defaultData"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import votersServices from "@/services/voters.service";
import VotersEditForm from "./VotersEditForm.vue";
import manageElectionMixins from "../../../mixins/manage-election.mixins";

export default manageElectionMixins.extend({
  props: {
    isOpen: Boolean,
    fetchFunc: Function,
  },

  components: {
    VotersEditForm,
  },

  data() {
    return {
      isOpenLocal: this.isOpen,
      defaultData: null,
    };
  },

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

  fetchOnServer: false,
  async fetch() {
    try {
      this.defaultData = await votersServices.getById(this.voterId);
      console.log(this.defaultData);
    } catch (error) {
      console.log(error);
    }
  },

  computed: {
    voterId(): string {
      return this.$route.params.voterId;
    },
  },

  methods: {
    cancelFunc() {
      this.isOpenLocal = false;
    },

    async submitFunc(body: any) {
      try {
        const result = await votersServices.update({
          ...body,
          id: this.voterId,
        });
        this.$accessor.snackbar.set({
          show: true,
          message: "Voters Successfully Updated!",
          timeout: 5000,
          color: "success",
        });
        this.isOpenLocal = false;
      } catch (error: any) {
        throw error.response.data.error;
      }
    },
  },
});
</script>