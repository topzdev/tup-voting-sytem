<template>
  <v-select
    :disabled="disabled"
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
      <v-list-item-content>
        <v-list-item-title class="text-capitilize">
          {{ data.item.title }}
        </v-list-item-title>
      </v-list-item-content>
    </template>
    <template v-slot:selection="data">
      <v-list-item-title class="text-capitilize">
        {{ data.item.title }}
      </v-list-item-title>
    </template>
  </v-select>
</template>


<script lang="ts">
import Vue, { PropOptions } from "vue";
import electionServices, { Election } from "~/services/election.service";
import ElectionStatusChip from "@/components/chips/ElectionStatusChip.vue";
import AppImage from "../app/AppImage.vue";
import positionServices, { Position } from "../../services/position.service";

type PositionItem = {
  title: string;
  id: string | null | number;
};

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

    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Select Position",
    },
    prepend: {
      type: Array,
      default() {
        return [];
      },
    } as PropOptions<PositionItem[]>,
    append: {
      type: Array,
      default() {
        return [];
      },
    } as PropOptions<PositionItem[]>,
  },

  data() {
    return {
      loading: true,
      items: [] as PositionItem[],
    };
  },

  methods: {
    async fetchItems(): Promise<void> {
      this.loading = true;
      try {
        const params: any = {};

        if (!this.electionId) return;

        const result = await positionServices.getAll(this.electionId, params);

        console.log(result);

        this.items = [
          ...this.prepend,
          ...result.items.filter((item) => item.id !== this.excludeId),
          ...this.append,
        ];
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
  },
  async created() {
    await this.fetchItems();
  },
});
</script>

<style>
</style>