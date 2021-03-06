import { RouteConfig } from "@nuxt/types/config/router";
import Vue from "vue";
import mixins from "vue-typed-mixins";
import pageStatus from "../configs/page-status.config";
import { Election, ElectionStatus } from "../services/election.service";
import manageElectionMixins from "./manage-election.mixins";

export type SettingLink = {
  icon: string;
  title: string;
  to?: RouteConfig | string;
  color?: string;
  route?: RouteConfig | string;
  status?: any[];
};

const settingsMixin = mixins(manageElectionMixins).extend({
  created() {
    console.log(this.$route);
  },

  computed: {
    pagePath(): string {
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
        ["election-emails"]: {
          icon: "mdi-email-multiple-outline",
          title: "Emails",
          to: this.emailRoute(),
          status: pageStatus.settings.emails.page,
        },
        ["publicity"]: {
          icon: "mdi-earth",
          title: "Publicity",
          to: this.publicityRoute(),
          status: pageStatus.settings.publicity.page,
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
        ["delete-election"]: {
          icon: "mdi-delete",
          title: "Delete Election",
          color: "red",
          to: this.deleteElectionRoute(),
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

    publicityRoute() {
      return `${this.pagePath}publicity`;
    },
    deleteElectionRoute() {
      return `${this.pagePath}delete-election`;
    },
  },
});

export default settingsMixin;
