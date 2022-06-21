<template>
  <v-row>
    <v-col
      v-if="!$fetchState.pending && !$fetchState.error"
      md="8"
      class="mx-auto"
    >
      <v-container v-if="election" class="py-0">
        <v-row>
          <v-col cols="12">
            <election-page-header
              :election="election"
              breadcrumbsOf="terms-and-condition"
            />
          </v-col>

          <v-col v-if="termsAndCondition" cols="12" lg="8" class="mx-auto">
            <h2
              class="mt-5 mb-10 text-center"
              v-text="termsAndCondition.title"
            ></h2>
            <p class="text--secondary">{{ termsAndCondition.lastUpdate }}</p>
            <span v-html="termsAndCondition.content"></span>
          </v-col>
        </v-row>
      </v-container>
    </v-col>

    <v-col v-else-if="$fetchState.pending">
      <page-center>
        <app-loading></app-loading>
      </page-center>
    </v-col>

    <v-col v-else-if="$fetchState.error">
      <page-center>
        <h2>Something went wrong</h2>
      </page-center>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import ElectionPageHeader from "@/components/pages/election/ElectionPageHeader.vue";
import PageCenter from "@/components/utils/PageCenter.vue";
import publicServices from "@/services/public";
import { Election, Organization } from "@/types/app";
import dayjs from "dayjs";
import Vue from "vue";
import { MetaInfo } from "vue-meta";
export default Vue.extend({
  components: {
    PageCenter,
    ElectionPageHeader,
  },

  data() {
    return {
      election: null as Election | null,
    };
  },

  head(): MetaInfo {
    if (!this.election) return {};

    return {
      title: `Terms and Condition - ${this.election.title}`,

      meta: [
        {
          name: "description",
          hid: "description",
          content: this.election.description,
        },
      ],
    };
  },

  async fetch() {
    await this.fetchElectionTermsAndCondition();
  },

  computed: {
    organization(): Organization | undefined {
      if (!this.election) return;
      return this.election.organization;
    },

    slug(): string {
      return this.$route.params.slug;
    },

    termsAndCondition(): any {
      if (!this.organization || !this.election) return "";

      return {
        title: `${this.election.title}'s Terms and Condition`,
        lastUpdate:
          "Last Update:" +
          dayjs(this.organization.terms_and_condition_last_update).format(
            "MMMM DD, YYYY"
          ),

        content: this.organization.terms_and_condition,
      };
    },
  },

  methods: {
    async fetchElectionTermsAndCondition() {
      if (!this.slug) return;
      const response = await publicServices.getElectionTermsAndCondition(
        this.slug
      );
      this.election = response;
    },
  },
});
</script>

<style>
</style>