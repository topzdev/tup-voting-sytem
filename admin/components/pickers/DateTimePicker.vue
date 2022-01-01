<template>
  <client-only>
    <v-datetime-picker
      :label="label"
      :rules="rules"
      :value="value"
      @input="$emit('input', $event)"
      :textFieldProps="textFieldProps"
    >
      <template v-slot:dateIcon>
        <v-icon>mdi-calendar</v-icon>
      </template>
      <template v-slot:timeIcon>
        <v-icon>mdi-clock</v-icon>
      </template>
    </v-datetime-picker>
  </client-only>
</template>

<script>
export default {
  props: {
    value: [String, Date],
    rules: Array,
    label: String,
    outlined: Boolean,
    hideDetails: [String, Boolean],
    required: Boolean,
  },
  data() {
    return {};
  },

  computed: {
    textFieldProps() {
      return { outlined: true, hideDetails: "auto", rules: this.rules };
    },
  },
};
</script>

<style>
</style>