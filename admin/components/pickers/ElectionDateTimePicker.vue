<template>
  <date-time-picker
    :label="label"
    v-model="tempValue"
    :rules="rules"
    :text-field-props="defaultTextFieldProps"
    :date-picker-props="defaultDatePickerProps"
    :time-pciker-props="defaultTimePickerProps"
  />
</template>

<script>
import DateTimePicker from "@/components/pickers/DateTimePicker.vue";
import Vue from "vue";

export default Vue.extend({
  components: { DateTimePicker },
  props: {
    value: [String, Date],
    rules: Array,
    label: String,
  },

  computed: {
    tempValue: {
      get() {
        // @ts-ignore
        return new Date(this.value);
      },
      set(value) {
        // @ts-ignore
        this.$emit("input", value);
      },
    },

    defaultTextFieldProps() {
      return {
        ...this.textFieldProps,
      };
    },

    defaultDatePickerProps() {
      return {
        min: new Date().toISOString(),
        // allowedDates: this.allowedDates,
        ...this.datePickerProps,
      };
    },

    defaultTimePickerProps() {
      return {
        min: new Date().toISOString(),
        // allowedDates: this.allowedDates,
        ...this.datePickerProps,
      };
    },
  },

  methods: {},
});
</script>

<style>
</style>