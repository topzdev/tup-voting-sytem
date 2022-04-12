<template>
  <v-row>
    <v-col cols="7" class="mx-auto">
      <v-container v-if="candidate" class="py-0">
        <v-row>
          <v-col cols="12">
            <candidate-page-header :candidate="candidate" />
          </v-col>

          <v-col cols="12">
            <v-col cols="7">
              <h3>Description</h3>
              <p v-html="candidate.description"></p>

              <h3 class="mt-4">Platform</h3>
              <p v-html="candidate.platform"></p>
            </v-col>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Candidate } from "@/types/app";
import publicServices from "@/services/public";
import CandidatePageHeader from "@/components/pages/candidate/CandidatePageHeader.vue";

export default Vue.extend({
  components: {
    CandidatePageHeader,
  },
  data() {
    return {
      candidate: null as Candidate | null,
    };
  },

  async fetch() {
    await this.fetchCandidate(parseInt(this.candidateId));
  },

  methods: {
    async fetchCandidate(id: number) {
      const response = await publicServices.getCandidates(id);
      this.candidate = response;
    },
  },

  computed: {
    candidateId() {
      return this.$route.params.candidateId;
    },
  },
});
</script>

<style>
</style>