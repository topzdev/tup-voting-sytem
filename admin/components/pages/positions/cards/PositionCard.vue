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
            <span class="text-capitalize"> {{ trimmedDescription }} </span>
          </p>
          <p class="caption mt-2 mb-0">{{ voteSelectText }}</p>
        </v-col>

        <v-col cols="auto" class="ml-auto">
          <v-btn
            v-if="hideByStatus(pageStatus.candidate.create) && !isArranging"
            color="primary"
            text
            :to="editPositionRoute(data.id)"
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
import restrictionsMixin from "../../../../mixins/restrictions.mixin";
import { Position } from "../../../../services/position.service";

export default mixins(positionsMixin, restrictionsMixin).extend({
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
      return `Voters can select a maximum of ${this.data.max_selected} and a minimum of ${this.data.min_selected} candidates`;
    },
    trimmedDescription(): string {
      const description = this.data.description;
      return description.length >= 150
        ? description.split("").splice(0, 150).join("") + "..."
        : description;
    },
  },
});
</script>

<style>
</style>