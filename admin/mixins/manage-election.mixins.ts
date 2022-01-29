import { RouteConfig } from "@nuxt/types/config/router";
import Vue from "vue";
import { Election, ElectionStatus } from "../services/election.service";
import { Organization } from "../services/organization.service";

type ManageElectionPage = {
  icon: string;
  title: string;
  to: string;
  status: string[];
  exactPath?: string;
};

type ElectionPageLinks = Record<string, ManageElectionPage>;

const manageElectionMixins = Vue.extend({
  computed: {
    manageElectionRoute(): string {
      if (!this.electionId) return "/";

      return `/manage/election/${this.electionId}/`;
    },

    electionId(): Election["id"] | null {
      return this.electionInfo ? this.electionInfo.id : null;
    },

    electionInfo(): Election | null {
      return this.$accessor.manageElection.election;
    },

    electionOrganizationInfo(): Organization | null {
      return this.$accessor.manageElection.organization;
    },

    organizationId(): Organization["id"] | null {
      return this.electionOrganizationInfo
        ? this.electionOrganizationInfo.id
        : null;
    },

    electionStatus(): ElectionStatus | null {
      if (!this.electionInfo) return null;
      return this.electionInfo?.final_status;
    },

    links(): ElectionPageLinks {
      const electionId = this.$route.params.electionId;
      const basePath = `/manage/election/${electionId}`;

      return {
        overview: {
          icon: "mdi-view-dashboard",
          title: "Overview",
          to: `${basePath}/overview`,
          status: ["all"],
        },

        results: {
          icon: "mdi-chart-box-outline",
          title: "Results",
          to: `${basePath}/results`,
          status: ["running", "election"],
        },

        party: {
          icon: "mdi-account-group",
          title: "Party",
          to: `${basePath}/party`,
          status: ["all"],
        },

        positions: {
          icon: "mdi-account-details",
          title: "Positions",
          to: `${basePath}/positions`,
          status: ["running", "election"],
        },

        candidates: {
          icon: "mdi-account-tie",
          title: "Candidates",
          to: `${basePath}/candidates`,
          status: ["all"],
        },

        voters: {
          icon: "mdi-account-group",
          title: "Voters",
          to: `${basePath}/voters`,
          status: ["all"],
        },

        settings: {
          icon: "mdi-cog",
          title: "Settings",
          to: `${basePath}/settings`,
          status: ["building"],
        },

        launchpad: {
          icon: "mdi-rocket",
          title: "Launchpad",
          to: `${basePath}/launchpad`,
          status: ["building"],
        },
      };
    },

    sidebarLinks(): ManageElectionPage[] {
      return Object.keys(this.links).map((item) => this.links[item]);
    },
  },
});

export default manageElectionMixins;
