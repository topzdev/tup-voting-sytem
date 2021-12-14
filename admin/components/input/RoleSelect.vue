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
          id: "watcher",
          text: "Watcher",
        },
        {
          id: "dev",
          text: "Developer",
        },
      ];
    },
  },
};
</script>

<style>
</style>