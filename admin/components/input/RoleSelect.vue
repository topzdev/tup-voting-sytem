<template>
  <v-select
    item-text="text"
    item-value="id"
    label="Role"
    placeholder="Role"
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
          id: "sadmin",
          text: "Super Admin",
        },
        {
          id: "admin",
          text: "Admin",
        },
        {
          id: "elec_ofc",
          text: "Election Officer",
        },
      ];
    },
  },
};
</script>

<style>
</style>