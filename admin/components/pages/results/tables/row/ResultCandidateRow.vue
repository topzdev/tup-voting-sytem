<template>
  <tr :class="background">
    <td v-if="withTieColumn" class="text-center">
      <div
        v-if="tie"
        style="
          display: block;
          height: 10px;
          width: 10px;
          min-width: 10px;
          border-radius: 100%;
        "
        class="light-blue"
      ></div>
    </td>
    <td>
      <div class="d-flex align-center">
        <v-avatar size="30">
          <app-image size="30" :src="item.profile_photo"></app-image>
        </v-avatar>

        <span class="ml-2"> {{ item.candidateName }}</span>
      </div>
    </td>
    <td>
      <party-chip :data="item.party"></party-chip>
    </td>
    <td>{{ item.votesCount }}</td>

    <td>{{ item.votePercentage }}%</td>
  </tr>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import PartyChip from "@/components/chips/PartyChip.vue";
export default Vue.extend({
  components: {
    PartyChip,
  },
  props: {
    idx: {
      type: Number,
    },
    item: {
      type: Object,
    },
    tie: {
      type: Boolean,
    },
    in: {
      type: Boolean,
    },
    withTieColumn: {
      type: Boolean,
    },
  },

  data() {
    return {
      background: "",
    };
  },

  methods: {
    setBackground() {
      if (this.in) {
        return "orange lighten-5";
      } else {
        return "blue-grey lighten-5";
      }
    },
  },

  watch: {
    in: {
      immediate: true,
      handler() {
        this.background = this.setBackground();
      },
    },
  },
});
</script>

<style>
</style>