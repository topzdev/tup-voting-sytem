<template>
  <page-center>
    <v-card width="450" flat>
      <v-card-title v-if="election">
        <v-row>
          <v-col class="d-flex justify-center" md="12">
            <v-avatar size="80">
              <app-image
                :size="80"
                :src="election.logo"
                :alt="election.title"
              />
            </v-avatar>
          </v-col>
          <v-col>
            <h1
              class="headline text-center w-100"
              style="word-break: break-word"
            >
              {{ election.title }} <br />
              <span class="font-weight-bold">Election</span>
            </h1>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text class="mt-5 text-center" v-if="electionError">
        <h1
          class="display-2 font-weight-bold text--primary mx-auto"
          v-html="electionError.title"
        >
          {{ electionError.title }}
        </h1>

        <p class="subtitle-1 text--secondary mt-2" v-html="electionError.body">
          {{ electionError.body }}
        </p>
      </v-card-text>

      <v-card-text
        v-if="!electionError && election"
        class="d-flex align-center"
      >
        <login-form :election_id="electionId" />
      </v-card-text>
    </v-card>
  </page-center>
</template>

<script lang="ts">
import LoginForm from "@/components/forms/LoginForm.vue";
import PageCenter from "@/components/utils/PageCenter.vue";
import Vue from "vue";
import ballotMixin from "@/mixins/ballot.mixins";

import mixins from "vue-typed-mixins";

export default mixins(ballotMixin).extend({
  auth: "guest",
  components: {
    LoginForm,
    PageCenter,
  },
});
</script>
