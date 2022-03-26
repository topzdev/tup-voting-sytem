<template>
  <v-data-table :items="candidates" :headers="headers" hide-default-footer>
    <template v-slot:item.legend="{}">
      <span
        style="
          display: flex;
          height: 15px;
          width: 15px;
          border-radius: 3px;
          background: green;
        "
      ></span>
    </template>

    <template v-slot:item.candidateName="{ item }">
      <div class="d-flex align-center">
        <v-avatar size="30">
          <app-image size="30" :src="item.profile_photo"></app-image>
        </v-avatar>

        <span class="ml-2"> {{ item.candidateName }}</span>
      </div>
    </template>

    <template v-slot:item.party="{ item }">
      <party-chip :data="item.party"></party-chip>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { ElectionResult } from "@/services/results.service";
import PartyChip from "@/components/chips/PartyChip.vue";

export default Vue.extend({
  props: {
    candidates: {
      type: Array,
    } as PropOptions<ElectionResult["candidates"]>,
  },
  components: {
    PartyChip,
  },

  data() {
    return {
      headers: [
        {
          text: "Legend",
          sortable: false,
          value: "legend",
        },
        {
          text: "Candidate",
          value: "candidateName",
        },
        {
          text: "Party",
          sortable: false,
          value: "party",
        },
        {
          text: "Vote Total",
          value: "votesCount",
        },
        {
          text: "Vote (%)",
          value: "votePercentage",
        },
      ],
    };
  },
});
</script>

<style>
</style>