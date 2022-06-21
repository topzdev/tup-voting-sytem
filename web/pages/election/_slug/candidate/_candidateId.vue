<template>
  <v-row>
    <v-col cols="12" md="7" class="mx-auto">
      <v-container v-if="candidate" class="py-0">
        <v-row>
          <v-col cols="12">
            <candidate-page-header :candidate="candidate" />
          </v-col>

          <v-col cols="12">
            <v-col md="7">
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
import { Candidate, Election } from "@/types/app";
import publicServices from "@/services/public";
import CandidatePageHeader from "@/components/pages/candidate/CandidatePageHeader.vue";
import { MetaInfo } from "vue-meta";

export default Vue.extend({
  components: {
    CandidatePageHeader,
  },
  data() {
    return {
      candidate: null as Candidate | null,
    };
  },
  head(): MetaInfo {
    if (!this.candidate) return {};

    return {
      title: `${this.fullname} for ${this.candidate.position?.title} - ${this.candidate.election?.title}`,

      meta: [
        {
          name: "description",
          hid: "description",
          content: this.candidate.description,
        },
      ],
    };
  },

  async fetch() {
    await this.fetchCandidate(parseInt(this.candidateId));
  },

  methods: {
    async fetchCandidate(id: number) {
      const response = await publicServices.getCandidates(id);

      const election = response.election;

      if (!election) return;

      const partialElection = {
        id: election.id,
        title: election.title,
        slug: election.slug,
      };

      const candidate = response;

      if (candidate && candidate.party) {
        candidate.party.election = partialElection as Election;
      }

      this.candidate = response;
    },
  },

  computed: {
    fullname(): string {
      if (!this.candidate) return "";
      return `${this.candidate.firstname} ${
        this.candidate.middlename ? this.candidate.middlename + ". " : ""
      }${this.candidate.lastname}`;
    },
    candidateId() {
      return this.$route.params.candidateId;
    },
  },
});
</script>

<style>
</style>