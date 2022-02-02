<template>
  <v-row style="height: 100%">
    <v-col v-if="list.loading" class="text-center" cols="12">
      <app-loading></app-loading>
    </v-col>
    <template v-if="!list.loading">
      <v-col cols="6" class="mx-auto" v-if="list.pagination.total">
        <draggable
          class="mb-4"
          :disabled="disabledByStatus(pageStatus.positions.arrange)"
          v-model="list.items"
          draggable=".item"
          v-bind="dragOptions"
          @start="start"
          @end="dragging = false"
        >
          <transition-group
            tag="v-row"
            class="no-gutters"
            type="transition"
            :name="!dragging ? 'flip-list' : null"
          >
            <v-col
              v-for="(item, idx) in list.items"
              :key="item.id"
              cols="12"
              class="item pt-2 pb-0"
            >
              <position-card
                :index="idx + 1"
                :data="item"
                :isDragging="dragging"
                :isArranging="isArranging"
              />
            </v-col>
          </transition-group>
        </draggable>
        <v-row no-gutters class="w-100">
          <v-col v-if="!isArranging" cols="12">
            <p class="caption">
              Drag one item on list to start items arrangement.
            </p>
          </v-col>
          <v-col class="d-flex" cols="12" v-if="isArranging">
            <v-btn :disabled="loading" depressed large @click="cancel"
              >Cancel</v-btn
            >

            <v-btn
              class="ml-auto"
              depressed
              color="primary"
              large
              @click="save"
              :disabled="loading"
              :loading="loading"
              >Save Arrangement
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <v-col
        v-else
        class="mx-auto text-center d-flex align-center justify-center h-100"
        md="5"
      >
        <position-empty />
      </v-col>
    </template>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import positionServices, {
  ArragePositionDto,
  Position,
} from "@/services/position.service";
import PositionCard from "./cards/PositionCard.vue";
import PositionEmpty from "./PositionEmpty.vue";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "../../../mixins/manage-election.mixins";
import positionService from "@/services/position.service";
import restrictionsMixin from "../../../mixins/restrictions.mixin";

export default mixins(manageElectionMixins, restrictionsMixin).extend({
  components: {
    PositionCard,
    PositionEmpty,
  },

  data() {
    return {
      loading: false,
      dragging: false,
      started: false,
      isArranging: false,

      oldItems: [] as Position[],

      list: {
        loading: true,
        items: [] as Position[],
        search: "",
        pagination: {
          page: 1,
          perPage: 10,
          total: 0,
          itemsPerPageOptions: [5, 10, 15, 20],
        },
      },
      // itemsLocal: this.list.items,
    };
  },

  computed: {
    draggingText(): string {
      return this.dragging ? `Dragging` : "";
    },
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },

  fetchOnServer: false,
  async fetch() {
    await this.fetchItems();
  },

  methods: {
    async fetchItems() {
      this.list.loading = true;

      if (!this.electionId) return;

      try {
        const result = await positionService.getAll(this.electionId, {});
        console.log(result);
        this.list.items = result.items;
        this.list.pagination.total = result.totalCount;
      } catch (error) {
        console.log(error);
      } finally {
        this.list.loading = false;
      }
    },

    cancel() {
      this.isArranging = false;
      this.list.items = this.oldItems;
    },

    start() {
      this.oldItems = this.list.items;
      this.isArranging = true;
      this.dragging = true;
    },

    async save() {
      this.loading = true;
      if (!this.electionId) throw Error("Election Id is required");

      try {
        const body: ArragePositionDto = {
          election_id: this.electionId,
          displayOrder: this.list.items.map((item, idx) => ({
            id: item.id,
            order: idx + 1,
          })),
        };

        console.log(body);

        const result = await positionServices.arrangePosition(body);

        console.log(result);

        this.$accessor.snackbar.set({
          show: true,
          message: "Position Arrangement Saved",
          timeout: 5000,
          color: "success",
        });
      } catch (error) {
        console.error(error);
        this.$accessor.snackbar.set({
          show: true,
          message: "Something went wrong",
          timeout: 5000,
          color: "success",
        });
        this.cancel();
      } finally {
        this.loading = false;
        this.isArranging = false;
      }
    },
  },

  // props: {
  //   items: {
  //     types: Array,
  //   } as PropOptions<Position[]>,
  // },
});
</script>

<style scoped lang="scss">
.ghost {
  opacity: 0.1;
  cursor: pointer !important;
}
.flip-list-move {
  transition: transform 0.5s;
}
</style>
