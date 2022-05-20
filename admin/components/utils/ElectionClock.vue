<template>
  <client-only>
    <span>
      <vue-countdown
        v-if="countdown"
        :time="countdown.time"
        :transform="transformSlotProps"
        v-slot="{ days, hours, minutes, seconds }"
      >
        {{ countdown.text }}
        <b>{{ days }}</b
        >d, <b>{{ hours }}</b
        >h, <b> {{ minutes }}</b
        >m, <b>{{ seconds }}</b
        >s.
      </vue-countdown>
    </span>
  </client-only>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import VueCountdown from "@chenfengyuan/vue-countdown";
import manageElectionMixins from "../../mixins/manage-election.mixins";

type Countdown = {
  time: number;
  text: string;
};

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

      if (
        this.electionStatus === "running" ||
        this.electionStatus === "preview"
      ) {
        return true;
      } else {
        return false;
      }
    },

    countdown(): Countdown | undefined {
      if (!this.electionInfo) return;

      const start_date = new Date(this.electionInfo.start_date).getTime();
      const close_date = new Date(this.electionInfo.close_date).getTime();
      const current_date = new Date().getTime();
      if (this.electionStatus === "preview") {
        return {
          text: "Election will start: ",
          time: start_date - current_date,
        };
      } else if (this.electionStatus === "running") {
        return {
          text: "Election will end: ",
          time: close_date - current_date,
        };
      }

      return;
    },
  },
});
</script>

<style>
</style>