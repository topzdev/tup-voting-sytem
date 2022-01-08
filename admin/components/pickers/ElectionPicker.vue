<template>
  <v-select
    :loading="loading"
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
import Vue, { PropOptions } from "vue";
import electionServices, { Election } from "~/services/election.service";
import ElectionStatusChip from "@/components/chips/ElectionStatusChip.vue";
import AppImage from "../app/AppImage.vue";
export default Vue.extend({
  components: { AppImage, ElectionStatusChip },
  props: {
    orgId: {
      type: Number,
    } as PropOptions<number>,

    excludeId: {
      type: Number,
    } as PropOptions<number>,

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

  methods: {
    async fetchItems(): Promise<void> {
      this.loading = true;
      try {
        const params: any = {};

        if (!this.excludeId && !!this.orgId) return;

        if (this.orgId) params.orgId = this.orgId;

        const result = await electionServices.getAll(this.orgId, params);

        console.log(result);

        this.items = result.items.filter((item) => item.id !== this.excludeId);
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
  },

  fetchOnServer: false,
  async fetch() {
    await this.fetchItems();
  },
});
</script>

<style>
</style>