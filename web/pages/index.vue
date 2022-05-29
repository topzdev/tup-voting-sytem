<template>
  <div>
    <homepage-carousel class="mb-5 mt-n5" />
    <v-container>
      <v-row>
        <template v-if="elections">
          <v-col v-if="preview && preview.length" cols="12" class="mx-auto">
            <h2 class="mb-2">Preview Election</h2>

            <v-row>
              <v-col
                v-for="item in preview"
                :key="item.id"
                cols="12"
                md="6"
                xl="4"
              >
                <election-card :election="item" />
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="running && running.length" cols="12" class="mx-auto">
            <h2 class="mb-2">Currently Running Elections</h2>

            <v-row>
              <v-col
                v-for="item in running"
                :key="item.id"
                cols="12"
                md="6"
                xl="4"
              >
                <election-card :election="item" />
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="completed && completed.length" cols="12" class="mx-auto">
            <h2 class="mb-2">Completed Elections</h2>

            <v-row>
              <v-col
                v-for="item in completed"
                :key="item.id"
                cols="12"
                md="6"
                xl="4"
              >
                <election-card :election="item" />
              </v-col>
            </v-row>
          </v-col>
        </template>
        <!-- <v-col cols="12">
        <h2 class="mb-2">Party</h2>

        <v-row>
          <v-col v-for="item in party" :key="item.id" cols="2">
            <party-card :party="item" />
          </v-col>
        </v-row>
      </v-col> -->
      </v-row>
    </v-container>
  </div>
</template>


<script lang="ts">
import Vue, { PropOptions } from "vue";
import publicServices, { HomepageElections } from "../services/public";
import { Election, Party } from "../types/app";
import ElectionCard from "~/components/cards/ElectionCard.vue";
import PartyCard from "~/components/cards/PartyCard.vue";
import HomepageCarousel from "@/components/pages/homepage/HomepageCarousel.vue";

export default Vue.extend({
  layout: "public",

  components: {
    ElectionCard,
    PartyCard,
    HomepageCarousel,
  },

  data() {
    return {
      elections: null as HomepageElections | null,
      party: [] as Party[],
    };
  },

  async fetch() {
    await this.fetchElections();
  },

  computed: {
    running(): Election[] | null {
      if (!this.elections) return null;

      return this.elections.running;
    },
    completed(): Election[] | null {
      if (!this.elections) return null;

      return this.elections.completed;
    },
    preview(): Election[] | null {
      if (!this.elections) return null;

      return this.elections.preview;
    },
  },

  methods: {
    async fetchElections() {
      const response = await publicServices.getHomepageElections();
      this.elections = response;
    },
    async fetchParties() {
      const response = await publicServices.getHomepageParties();
      this.party = response;
    },
  },
});
</script>

<style>
</style>

