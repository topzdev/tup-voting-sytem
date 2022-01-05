<template>
  <v-container>
    <v-row no-gutters>
      <v-col
        v-if="hasStateSlot"
        class="mx-auto text-center d-flex align-center justify-center"
        style="min-height: 60vh"
        md="6"
      >
        <slot name="states"></slot>
      </v-col>

      <v-col
        v-if="hasCenteredSlot"
        class="mx-auto text-center d-flex align-center"
        md="6"
      >
        <slot name="centered"></slot>
      </v-col>

      <v-col
        v-if="hasFormSlot"
        class="mx-auto text-center d-flex align-center"
        md="4"
      >
        <slot name="form"></slot>
      </v-col>

      <v-col v-if="hasFullWidthSlot" cols="12">
        <v-row no-gutters>
          <v-col cols="12">
            <slot name="full"></slot>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  computed: {
    hasStateSlot() {
      return this.$slots.states;
    },
    hasCenteredSlot() {
      return this.$slots.centered;
    },

    hasFullWidthSlot() {
      return this.$slots.full;
    },

    hasFormSlot() {
      return this.$slots.form;
    },
  },
});
</script>

<style>
</style>