import { RouteConfig } from "@nuxt/types/config/router";
import Vue from "vue";
import mixins from "vue-typed-mixins";
import manageElectionMixins from "./manage-election.mixins";

export type SettingLink = {
  icon: string;
  title: string;
  to: RouteConfig | string;
};

const settingsMixin = mixins(manageElectionMixins).extend({
  created() {
    console.log(this.$route);
  },

  computed: {
    pagePath() {
      return `settings/`;
    },
    pages(): Record<string, SettingLink> {
      return {
        general: {
          icon: "mdi-tune",
          title: "General",
          to: this.generalRoute(),
        },
        ["close-election"]: {
          icon: "mdi-close-box-outline",
          title: "Close Election",
          to: this.closeElectionRoute(),
        },
        ["election-dates"]: {
          icon: "mdi-calendar-clock-outline",
          title: "Dates",
          to: this.updateElectionDates(),
        },
        ["archive-election"]: {
          icon: "mdi-archive-arrow-down-outline",
          title: "Archive Election",
          to: this.archiveElectionRoute(),
        },
      };
    },
  },

  methods: {
    generalRoute() {
      return `${this.pagePath}general`;
    },
    closeElectionRoute() {
      return `${this.pagePath}close-election`;
    },
    updateElectionDates() {
      return `${this.pagePath}dates`;
    },
    archiveElectionRoute() {
      return `${this.pagePath}archive-election`;
    },
  },
});

export default settingsMixin;
