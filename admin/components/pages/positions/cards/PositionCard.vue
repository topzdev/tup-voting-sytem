<template>
  <v-card>
    <v-card-text>
      <v-row no-gutters align="center">
        <v-col cols="auto">
          <v-avatar
            color="primary"
            class="white--text"
            size="50"
            :title="data.slot_position"
          >
            {{ data.slot_position }}
          </v-avatar>
        </v-col>
        <v-col class="px-3 d-flex flex-column justify-center text-left">
          <h2 class="title text-truncate text--primary" :title="data.title">
            {{ data.title }}
          </h2>
          <p v-if="data.description" class="body-2 my-0 text--secondary">
            {{ data.description }} - {{ voteSelectText }}
          </p>
        </v-col>

        <v-col cols="auto" class="ml-auto">
          <v-btn color="primary" text @click="editPositionRoute(data.id)"
            >View</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import positionsMixin from "@/mixins/position.mixins";
import { PropOptions } from "vue";
import mixins from "vue-typed-mixins";

export default mixins(positionsMixin).extend({
  props: {
    data: {
      type: Object,
      required: true,
    } as PropOptions<any>,
  },

  computed: {
    voteSelectText(): string {
      return `Vote select maximum is ${this.data.max_vote} and minimum ${this.data.min_vote}`;
    },
  },
});
</script>

<style>
</style>