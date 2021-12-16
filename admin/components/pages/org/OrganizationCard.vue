<template>
  <v-card>
    <v-card-text>
      <v-row no-gutters align="center">
        <v-col cols="auto">
          <v-avatar size="60" :title="org.ticker">
            <img :src="org.logo.url" :alt="org.title" />
          </v-avatar>
        </v-col>
        <v-col class="px-3 d-flex flex-column justify-center text-left">
          <h2
            class="title text-truncate d-inline-block"
            style="max-width: 320px"
            :title="org.title"
          >
            {{ org.title }}
          </h2>
          <p v-if="org.description" class="body-2 my-0 text--secondary">
            {{ org.description }}
          </p>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-btn color="primary" text :to="`/org/${org.id}/edit`">View</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Organization } from "../../../services/organization.service";

export default Vue.extend({
  props: {
    org: {
      type: Object,
      required: true,
    } as PropOptions<Organization>,
  },
});
</script>

<style>
</style>