<template>
  <v-select
    item-text="text"
    item-value="id"
    label="Registration"
    placeholder="Registration"
    outlined
    hide-details="auto"
    :items="items"
    :value="value"
    :loading="loading"
    :rules="rules"
    :readonly="readonly"
    @input="$emit('input', $event)"
  ></v-select>
</template>


<script>
export default {
  data() {
    return {
      loading: false,
    };
  },
  props: {
    value: {
      type: [String, Number],
    },
    rules: {
      type: Array,
    },
    readonly: {
      type: Boolean,
    },
  },
  computed: {
    items() {
      return [
        {
          id: "all",
          text: "All",
        },
        {
          id: "reg",
          text: "Registered",
        },
        {
          id: "prereg",
          text: "Pre-Registered",
        },
      ];
    },
  },
};
</script>

<style>
</style>