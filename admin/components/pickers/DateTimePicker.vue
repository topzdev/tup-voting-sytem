<template>
  <v-datetime-picker
    :label="label"
    v-model="tempValue"
    :disabled="disabled"
    :text-field-props="defaultTextFieldProps"
    :date-picker-props="defaultDatePickerProps"
    :time-pciker-props="defaultTimePickerProps"
  >
    <template v-slot:dateIcon>
      <v-icon>mdi-calendar</v-icon>
    </template>
    <template v-slot:timeIcon>
      <v-icon>mdi-clock</v-icon>
    </template>
  </v-datetime-picker>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  props: {
    value: [String, Date],
    rules: Array,
    label: String,
    outlined: Boolean,
    disabled: Boolean,
    hideDetails: [String, Boolean],
    required: Boolean,
    textFieldProps: Object,
    datePickerProps: Object,
    timePickerProps: Object,
  },

  computed: {
    tempValue: {
      get() {
        // @ts-ignore
        return this.value ? new Date(this.value) : null;
      },
      set(value) {
        // @ts-ignore
        this.$emit("input", value);
      },
    },

    defaultTextFieldProps() {
      return {
        outlined: true,
        hideDetails: "auto",
        rules: this.rules,
        ...this.textFieldProps,
      };
    },

    defaultDatePickerProps() {
      return {
        ...this.datePickerProps,
      };
    },

    defaultTimePickerProps() {
      return {
        ...this.timePickerProps,
      };
    },
  },
});
</script>

<style>
</style>