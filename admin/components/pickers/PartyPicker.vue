<template>
  <v-select
    :loading="loading"
    item-text="title"
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
        </v-list-item-title>
      </v-list-item-content>
    </template>
    <template v-slot:selection="data">
      <v-list-item-avatar size="40">
        <app-image :size="40" :alt="data.item.title" :src="data.item.logo" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-capitilize">
          {{ data.item.title }}
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
import { Party } from "../../services/candidate.service";
export default Vue.extend({
  components: { AppImage, ElectionStatusChip },
  props: {
    electionId: {
      type: Number,
    } as PropOptions<number>,

    excludeId: {
      type: Number,
    } as PropOptions<number>,

    value: {
      type: [Number, String],
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
      default: "Select Party",
    },
  },

  data() {
    return {
      loading: true,
      items: [] as Party[],
    };
  },

  methods: {
    async fetchItems(): Promise<void> {
      this.loading = true;
      try {
        const params: any = {};

        if (!this.electionId) return;

        const result = [];

        console.log(result);

        // this.items = result.items.filter((item) => item.id !== this.excludeId);
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