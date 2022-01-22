<template>
  <v-text-field
    :outlined="outlined"
    :hide-details="hideDetails"
    :value="value"
    @input="$emit('input', $event)"
    :rules="rules"
    :label="label"
    :type="type"
    :append-icon="icon"
    @click:append="toggle = !toggle"
    :required="required"
  ></v-text-field>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    value: String,
    rules: Array,
    label: String,
    outlined: Boolean,
    hideDetails: [String, Boolean],
    required: Boolean,
  },

  data() {
    return {
      toggle: false,
    };
  },

  computed: {
    type(): string {
      return this.toggle ? "text" : "password";
    },
    icon(): string {
      return this.toggle ? "mdi-eye" : "mdi-eye-off";
    },
  },
});
</script>

<style>
</style>