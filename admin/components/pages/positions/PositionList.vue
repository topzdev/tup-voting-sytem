<template>
  <span>
    <draggable
      class="mb-4"
      v-model="itemsLocal"
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
          v-for="(item, idx) in itemsLocal"
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
        <p class="caption">Drag one item on list to start items arrangement.</p>
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
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import positionServices, {
  ArragePositionDto,
  Position,
} from "@/services/position.service";
import PositionCard from "./cards/PositionCard.vue";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "../../../mixins/manage-election.mixins";

export default mixins(manageElectionMixins).extend({
  components: {
    PositionCard,
  },

  data() {
    return {
      loading: false,
      dragging: false,
      started: false,
      isArranging: false,
      itemsLocal: this.items,
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

  methods: {
    cancel() {
      this.isArranging = false;
      this.itemsLocal = this.items;
    },

    start() {
      this.isArranging = true;
      this.dragging = true;
    },

    async save() {
      this.loading = true;
      if (!this.electionId) throw Error("Election Id is required");

      try {
        const body: ArragePositionDto = {
          election_id: this.electionId,
          displayOrder: this.itemsLocal.map((item, idx) => ({
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

  props: {
    items: {
      types: Array,
    } as PropOptions<Position[]>,
  },
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
