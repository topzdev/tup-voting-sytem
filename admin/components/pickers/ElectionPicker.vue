<template>
  <v-select
    item-text="name"
    item-value="id"
    :label="label"
    :placeholder="placeholder"
    outlined
    hide-details="auto"
    :items="items"
    :value="value"
    :rules="rules"
    @input="$emit('input', $event)"
  >
    <template v-slot:item="data">
      <v-list-item-avatar size="40">
        <app-image :size="40" :alt="data.item.title" :src="data.item.logo" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-capitilize">
          {{ data.item.title }}

          <election-status-chip status="building" small outlined />
        </v-list-item-title>
        <v-list-item-subtitle
          class="d-inline-block text-truncate"
          style="max-width: 400px"
          v-text="data.item.description"
        />
      </v-list-item-content>
    </template>
    <template v-slot:selection="data">
      <v-list-item-avatar size="40">
        <app-image :size="40" :alt="data.item.title" :src="data.item.logo" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-capitilize">
          {{ data.item.title }}
          <election-status-chip status="building" small />
        </v-list-item-title>
      </v-list-item-content>
    </template>
  </v-select>
</template>


<script lang="ts">
import electionServices, { Election } from "~/services/election.service";
import ElectionStatusChip from "@/components/chips/ElectionStatusChip.vue";
import AppImage from "../app/AppImage.vue";
export default {
  components: { AppImage, ElectionStatusChip },
  props: {
    orgId: {
      type: Number,
    },

    excludeId: {
      type: Number,
    },

    value: {
      type: Number,
    },
    rules: {
      type: Array,
    },

    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Select Election",
    },
  },

  data() {
    return {
      loading: true,
      items: [] as Election[],
    };
  },

  async fetch() {
    await this.fetchItems();
  },

  methods: {
    async fetchItems() {
      try {
        const params: any = {};

        if (this.orgId) params.orgId = this.orgId;

        const result = await electionServices.getAll(params);

        console.log(result);

        this.items = result.items.filter((item) => item.id !== this.excludeId);
      } catch (error) {}
    },
  },
};
</script>

<style>
</style>