<template></template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  data() {
    return {
      table: {
        loading: false,
        headers: [
          {
            text: "Name",
            value: "name",
          },
          {
            text: "Email",
            value: "email",
          },
          {
            text: "Designation",
            value: "employee[0].designation.name",
          },
          {
            text: "Status",
            value: "status",
          },
          {
            text: "Action",
            value: "actions",
          },
        ],
        pagination: {
          page: 1,
          perPage: 10,
          total: 0,
          itemsPerPageOptions: [5, 10, 15, 20],
        },
        search: null,
        items: [],
      },
    };
  },

  async fetch() {},
});
</script>

<style>
</style>