import { RouteConfig } from "@nuxt/types/config/router";
import Vue from "vue";
import mixins from "vue-typed-mixins";
import pageStatus from "../configs/page-status.config";
import { Election, ElectionStatus } from "../services/election.service";
import manageElectionMixins from "./manage-election.mixins";

export type SettingLink = {
  icon: string;
  title: string;
  to: RouteConfig | string;
  status?: any[];
};

const settingsMixin = mixins(manageElectionMixins).extend({
  created() {
    console.log(this.$route);
  },

  computed: {
    pagePath() {
      return `/manage/election/${this.electionId}/settings/`;
    },
    pages(): Record<string, SettingLink> {
      return {
        general: {
          icon: "mdi-tune",
          title: "General",
          to: this.generalRoute(),
        },
        ["election-dates"]: {
          icon: "mdi-calendar-clock-outline",
          title: "Dates",
          to: this.updateElectionDates(),
        },
        ["close-election"]: {
          icon: "mdi-close-box-outline",
          title: "Close Election",
          to: this.closeElectionRoute(),
          status: pageStatus.settings.closeElection,
        },
        ["archive-election"]: {
          icon: "mdi-archive-arrow-down-outline",
          title: "Archive Election",
          to: this.archiveElectionRoute(),
          status: pageStatus.settings.archiveElection,
        },
        ["election-emails"]: {
          icon: "mdi-email-multiple-outline",
          title: "E-Mails",
          to: this.emailRoute(),
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
    emailRoute() {
      return `${this.pagePath}emails`;
    },
  },
});

export default settingsMixin;
