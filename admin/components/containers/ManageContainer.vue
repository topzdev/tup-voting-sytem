<template>
  <v-container fluid style="height: 70vh">
    <v-row v-if="!hasDefaultSlot" no-gutters>
      <v-col
        v-if="hasStateSlot"
        class="mx-auto text-center d-flex align-center justify-center"
        md="6"
      >
        <slot name="states"></slot>
      </v-col>

      <v-col
        v-if="hasCenteredSlot"
        class="mx-auto d-flex"
        cols="12"
        md="8"
        xl="6"
      >
        <slot name="centered"></slot>
      </v-col>

      <v-col
        v-if="hasFormSlot"
        class="mx-auto text-center d-flex align-center mt-10"
        cols="12"
        md="8"
        lg="6"
        xl="4"
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

    <slot v-else></slot>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  computed: {
    hasDefaultSlot() {
      return this.$slots.default;
    },

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