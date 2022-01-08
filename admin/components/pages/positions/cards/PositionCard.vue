<template>
  <v-card style="cursor: pointer">
    <v-card-text>
      <v-row no-gutters align="center">
        <v-col cols="auto">
          <v-avatar :color="data.display_order ? 'primary' : 'grey'" size="60">
            <span v-if="!isArranging" class="white--text text-h6">{{
              index
            }}</span>
            <v-icon dark size="30" v-else>mdi-drag</v-icon>
          </v-avatar>
        </v-col>
        <v-col class="px-3 d-flex flex-column justify-center text-left">
          <h2 class="title text-truncate text--primary" :title="data.title">
            {{ data.title }}
          </h2>
          <p v-if="data.description" class="body-2 my-0 text--secondary">
            <span class="text-capitalize"> {{ data.description }} </span>-
            {{ voteSelectText }}
          </p>
        </v-col>

        <v-col cols="auto" class="ml-auto">
          <v-btn
            v-if="!isArranging"
            color="primary"
            text
            @click="editPositionRoute(data.id)"
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
import { Position } from "../../../../services/position.service";

export default mixins(positionsMixin).extend({
  props: {
    index: Number,
    isDragging: Boolean,
    isArranging: Boolean,
    data: {
      type: Object,
      required: true,
    } as PropOptions<Position>,
  },

  computed: {
    voteSelectText(): string {
      return `Vote select maximum is ${this.data.max_selected} and minimum ${this.data.min_selected}`;
    },
  },
});
</script>

<style>
</style>