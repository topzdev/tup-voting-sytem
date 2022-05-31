<template>
  <v-data-table
    v-model="table.selected"
    :show-select="showSelect"
    :single-select="false"
    :loading="table.loading"
    :headers="headers"
    :items="table.items"
    :server-items-length="table.pagination.total"
    :page.sync="table.pagination.page"
    :items-per-page.sync="table.pagination.perPage"
    :footer-props="{
      'items-per-page-options': itemsPerPageOptions,
    }"
  >
    <template v-slot:item.voted="{ item }">
      <v-icon v-if="item.voted" color="green">mdi-check-all</v-icon>
      <v-icon v-else>mdi-minus-circle-outline</v-icon>
    </template>
    <template v-slot:item.registered="{ item }">
      {{ item.is_pre_register ? "No" : "Yes" }}
    </template>
    <template v-slot:item.disabled="{ item }">
      {{ item.disabled ? "Yes" : "No" }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="editVoterRoute(item.id)">
            <v-icon> mdi-pencil </v-icon>
          </v-btn>
        </template>
        <span>Edit Voter</span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import restrictionsMixin from "@/mixins/restrictions.mixin";
import mixins from "vue-typed-mixins";

export default mixins(restrictionsMixin).extend({
  props: {
    itemsPerPageOptions: Array,
    table: Object,
  },
  computed: {
    showSelect(): any {
      return this.hideByStatus(this.pageStatus.voters.table.action);
    },

    headers(): any {
      return this.filterByStatus([
        {
          text: "Is Voted",
          value: "voted",
          status: this.pageStatus.voters.table.isVoted,
        },
        {
          text: "Voter ID",
          value: "username",
        },
        {
          text: "Email Address",
          value: "email_address",
        },
        {
          text: "Firstname",
          value: "firstname",
        },
        {
          text: "Lastname",
          value: "lastname",
        },
        {
          text: "Registered",
          value: "registered",
          width: 150,
          align: "center",
          sortable: false,
        },
        {
          text: "Disabled",
          value: "disabled",
          width: 150,
          align: "center",
          sortable: false,
        },
        {
          text: "Action",
          value: "actions",
          status: this.pageStatus.voters.table.action,
          sortable: false,
          align: "right",
        },
      ]);
    },
  },
});
</script>

<style>
</style>