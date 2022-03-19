<template>
  <page-center style="min-height: 90vh">
    <v-card width="450" flat>
      <v-row>
        <v-col cols="12">
          <v-row>
            <v-col v-if="election" cols="12">
              <election-header :election="election" />
            </v-col>

            <v-col v-if="electionError" cols="12">
              <election-error :electionError="electionError"></election-error>
            </v-col>

            <v-col v-if="!electionError && election" cols="12">
              <login-form :election_id="electionId" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </page-center>
</template>

<script lang="ts">
import LoginForm from "@/components/forms/LoginForm.vue";
import PageCenter from "@/components/utils/PageCenter.vue";
import Vue from "vue";
import ballotMixin from "@/mixins/ballot.mixins";

import mixins from "vue-typed-mixins";
import ElectionHeader from "@/components/pages/election/ElectionHeader.vue";
import ElectionError from "@/components/pages/election/ElectionError.vue";

export default mixins(ballotMixin).extend({
  auth: "guest",
  components: {
    LoginForm,
    PageCenter,
    ElectionHeader,
    ElectionError,
  },
});
</script>
