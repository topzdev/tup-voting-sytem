<template>
  <v-chip
    :large="large"
    :small="small"
    :color="style.color"
    :outlined="outlined"
    :dark="style.dark || dark"
    style="border-width: 2px"
  >
    {{ style.text }}
  </v-chip>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { ElectionStatus } from "../../services/election.service";

type StatusStyles = Record<
  ElectionStatus,
  {
    text: string;
    color: string;
    dark?: boolean;
  }
>;

const statuses: StatusStyles = {
  completed: { text: "Completed", color: "blue" },
  preview: { text: "Preview", color: "orange" },
  running: { text: "Running", color: "success" },
  building: { text: "Building", color: "yellow darken-1" },
  archived: { text: "Archived", color: "amber", dark: true },
};

export default Vue.extend({
  props: {
    status: { type: String } as PropOptions<ElectionStatus>,
    large: Boolean,
    small: Boolean,
    dark: Boolean,
    outlined: { type: Boolean, default: false },
  },

  computed: {
    style(): StatusStyles["building"] {
      return statuses[this.status];
    },
  },
});
</script>

<style>
</style>