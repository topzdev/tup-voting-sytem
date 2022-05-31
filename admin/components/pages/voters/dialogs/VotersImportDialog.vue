<template>
  <v-row justify="center">
    <v-dialog v-model="isOpenLocal" max-width="600px">
      <v-card :loading="loading">
        <v-card-title class="mb-4">
          <span class="text-h5" v-text="dialogTitle"></span>
        </v-card-title>

        <v-card-text class="mb-0" v-if="step === 'default'">
          <v-row no-gutters>
            <v-col cols="12" class="mb-3">
              <voters-import-card
                color="blue"
                icons="mdi-file"
                title="Import voters list from CSV"
                body="Upload bulk voters info with excel, csv or any spreadsheet format"
                :proceedFunc="gotoForm.bind(null, 'csv')"
              />
            </v-col>

            <v-col cols="12">
              <voters-import-card
                color="pink"
                icons="mdi-flip-to-front"
                title="Copy voters from other election"
                body=" Include voters from previous or other election within your organization"
                :proceedFunc="gotoForm.bind(null, 'election')"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text class="mb-0" v-if="step === 'csv'">
          <VotersImportFromCSVForm
            :cancelFunc="gotoForm.bind(null, 'default')"
            :submitFunc="importFromCSV"
          />
        </v-card-text>

        <v-card-text class="mb-0" v-if="step === 'election'">
          <voters-import-from-election-form
            :cancelFunc="gotoForm.bind(null, 'default')"
            :submitFunc="importFromElection"
          />
        </v-card-text>

        <v-card-actions v-if="step === 'default'">
          <v-btn text class="ml-auto" @click="cancelFunc"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import votersServices from "@/services/voters.service";
import VotersImportCard from "../cards/VotersImportCard.vue";
import VotersImportFromCSVForm from "../forms/VotersImportFromCSVForm.vue";
import VotersImportFromElectionForm from "../forms/VotersImportFromElectionForm.vue";
import mixins from "vue-typed-mixins";
import votersMixin from "../../../../mixins/voters.mixin";

const forms = {
  csv: {
    title: "Import voters list from CSV",
    body: "Upload bulk voters info with excel, csv or any spreedshet format",
  },
  election: {
    title: "Copy voters from other election",
    body: "Include voters from previous or other election within your",
  },
  default: {
    title: "Import Voters",
  },
};

type FormKeys = keyof typeof forms;

export default mixins(votersMixin, manageElectionMixins).extend({
  props: {
    isOpen: Boolean,
  },

  components: {
    VotersImportCard,
    VotersImportFromCSVForm,
    VotersImportFromElectionForm,
  },

  data() {
    return {
      loading: false,
      isOpenLocal: this.isOpen,
      step: "default" as FormKeys,
    };
  },

  computed: {
    dialogTitle(): string {
      return forms[this.step].title;
    },
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

  methods: {
    cancelFunc() {
      this.isOpenLocal = false;
    },

    gotoForm(form: FormKeys) {
      this.step = form;
    },

    async importFromCSV(body: any) {
      if (!this.electionId) return;

      try {
        const result = await votersServices.importByCsv(body.file, {
          election_id: this.electionId,
        });
        this.$accessor.snackbar.set({
          show: true,
          message: "Voters Successfully Imported!",
          timeout: 5000,
          color: "success",
        });
        this.isOpenLocal = false;
        this.refreshTable();
      } catch (error: any) {
        throw error.response.data.error;
      }
    },

    async importFromElection(body: any) {
      if (!this.electionId) return;

      try {
        const result = await votersServices.importByElection({
          electionIds: {
            from: body.election_id,
            to: this.electionId,
          },
        });
        this.$accessor.snackbar.set({
          show: true,
          message: "Voters Successfully Imported!",
          timeout: 5000,
          color: "success",
        });
        this.isOpenLocal = false;
        this.refreshTable();
      } catch (error: any) {
        throw error.response.data.error;
      }
    },
  },
});
</script>