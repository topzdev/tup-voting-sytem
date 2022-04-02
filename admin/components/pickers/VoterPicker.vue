<template>
  <v-autocomplete
    color="primary"
    label="Search Voters"
    v-model="selected"
    :loading="loading"
    :items="items"
    item-text="searchString"
    item-value="id"
    :search-input.sync="search"
    cache-items
    filled
    chips
    multiple
    outlined
    hide-no-data
    hide-details="auto"
  >
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        close
        @click="data.select"
        @click:close="remove(data.item)"
      >
        {{ data.item.firstname + " " + data.item.lastname }} ({{
          data.item.email_address
        }})
      </v-chip>
    </template>
    <template v-slot:item="data">
      <template>
        <v-list-item-content>
          <v-list-item-title
            v-html="data.item.firstname + ' ' + data.item.lastname"
          ></v-list-item-title>
          <v-list-item-subtitle
            v-html="data.item.email_address"
          ></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { debounce } from "debounce";
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "../../mixins/manage-election.mixins";
import { Election } from "../../services/election.service";
import votersServices from "../../services/voters.service";

export default mixins(manageElectionMixins).extend({
  props: {
    orgId: {
      type: Number,
    } as PropOptions<number>,

    excludeId: {
      type: Number,
    } as PropOptions<number>,

    value: {
      type: Array,
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
      loading: false,
      items: [],
      selected: [],
      model: null,
      search: null,
      tab: null,
    };
  },

  methods: {
    async fetchItems() {
      if (!this.electionId || !this.search) return;

      try {
        this.loading = true;
        const data = await votersServices.getAll(this.electionId, {
          order: "ASC",
          page: 1,
          take: 10,
          search: this.search,
        });

        this.items = data.items.map((item) => ({
          ...item,
          searchString:
            item.firstname +
            " " +
            item.lastname +
            " " +
            item.email_address +
            " " +
            item.username,
        }));
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },

    remove(item: any) {
      console.log("Remove Item", item);

      const index = this.selected.indexOf(item.id as never);
      if (index >= 0) this.selected.splice(index, 1);
    },
  },

  watch: {
    selected(value) {
      this.$emit("input", value);
    },

    value(value) {
      this.selected = value;
    },

    search: debounce(async function () {
      // @ts-ignore
      await this.fetchItems();
    }, 500),
  },
});
</script>

<style scoped>
.voter-picker {
}
</style>