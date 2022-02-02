<template>
  <client-only v-if="countdownShow">
    <vue-countdown
      :time="countdownTime"
      :transform="transformSlotProps"
      v-slot="{ days, hours, minutes, seconds }"
    >
      {{ countdownText }} <b>{{ days }}</b
      >d, <b>{{ hours }}</b
      >h, <b> {{ minutes }}</b
      >m, <b>{{ seconds }}</b
      >s.
    </vue-countdown>
  </client-only>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import VueCountdown from "@chenfengyuan/vue-countdown";
import manageElectionMixins from "../../mixins/manage-election.mixins";
export default mixins(manageElectionMixins).extend({
  components: {
    VueCountdown,
  },
  data() {
    return {
      startTime: 0,
      endTime: 0,
    };
  },

  methods: {
    transformSlotProps(props: any) {
      const formattedProps = {};

      Object.entries(props).forEach(([key, value]) => {
        formattedProps[key] = (value as any) < 10 ? `0${value}` : String(value);
      });

      return formattedProps;
    },
  },

  computed: {
    countdownShow(): boolean {
      if (!this.electionStatus) return false;

      if (this.electionStatus === "running") {
        return true;
      } else {
        return false;
      }
    },

    countdownText(): string | undefined {
      if (!this.electionInfo) return;

      const start_date = new Date(this.electionInfo.start_date).getTime();
      const close_date = new Date(this.electionInfo.close_date).getTime();
      const one_day_seconds = 86400;
      const current_date = new Date().getTime();
      if (this.electionStatus === "running") {
        if (current_date <= start_date) {
          return "Election will start: ";
        } else {
          return "Election time remaining: ";
        }
      }
    },

    countdownTime(): number | undefined {
      if (!this.electionInfo) return;

      const start_date = new Date(this.electionInfo.start_date).getTime();
      const close_date = new Date(this.electionInfo.close_date).getTime();
      const current_date = new Date().getTime();
      if (this.electionStatus === "running") {
        if (new Date().getTime() <= new Date(start_date).getTime()) {
          return new Date(start_date).getTime() - current_date;
        } else {
          return new Date(close_date).getTime() - current_date;
        }
      }
    },
  },
});
</script>

<style>
</style>