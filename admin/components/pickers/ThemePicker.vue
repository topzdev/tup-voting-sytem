<template>
  <v-select
    :items="colors"
    item-value="color"
    :placeholder="placeholder"
    :label="label"
    :outlined="outlined"
    :hide-details="hideDetails"
    :value="value"
    @input="$emit('input', $event)"
  >
    <template v-slot:append>
      <v-icon>mdi-palette</v-icon>
    </template>
    <template v-slot:selection="data">
      <!-- HTML that describe how select should render selected items -->
      <v-list-item-content style="flex-basis: 100%">
        <v-list-item-title class="text-capitalize">
          <v-avatar size="20" :color="data.item.color"></v-avatar>
          {{ data.item.color }}
        </v-list-item-title>
      </v-list-item-content>
    </template>
    <template v-slot:item="data">
      <v-list-item-content>
        <v-list-item-title class="text-capitalize">
          <v-avatar size="20" :color="data.item.color"></v-avatar>
          {{ data.item.color }}
        </v-list-item-title>
      </v-list-item-content>
    </template>
  </v-select>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import systemColors from "~/configs/system-colors.config";

export default Vue.extend({
  props: {
    label: String,
    hideDetails: String,
    placeholder: String,
    value: {
      type: String,
    },
    rules: {
      type: Array,
    },
    outlined: Boolean,
  },

  computed: {
    colors() {
      return systemColors;
    },
  },
});
</script>

<style>
</style>