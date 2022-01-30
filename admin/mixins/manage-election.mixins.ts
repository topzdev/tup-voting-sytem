import { statusOnlyAllowed } from "@/helpers/isAllowedByStatus.helper";
import { Election, ElectionStatus } from "@/services/election.service";
import { Organization } from "@/services/organization.service";
import Vue from "vue";
import pageStatus from "@/configs/page-status.config";

type ManageElectionPage = {
  icon: string;
  title: string;
  to: string;
  status?: any[];
  exactPath?: string;
  show?: boolean;
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
        },

        results: {
          icon: "mdi-chart-box-outline",
          title: "Results",
          to: `${basePath}/results`,
          status: pageStatus.results,
        },

        party: {
          icon: "mdi-account-group",
          title: "Party",
          to: `${basePath}/party`,
        },

        positions: {
          icon: "mdi-account-details",
          title: "Positions",
          to: `${basePath}/positions`,
        },

        candidates: {
          icon: "mdi-account-tie",
          title: "Candidates",
          to: `${basePath}/candidates`,
        },

        voters: {
          icon: "mdi-account-group",
          title: "Voters",
          to: `${basePath}/voters`,
        },

        settings: {
          icon: "mdi-cog",
          title: "Settings",
          to: `${basePath}/settings`,
        },

        launchpad: {
          icon: "mdi-rocket",
          title: "Launchpad",
          to: `${basePath}/launchpad`,
          status: pageStatus.launchpad,
        },
      };
    },

    sidebarLinks(): ManageElectionPage[] {
      return Object.keys(this.links)
        .map((item) => this.links[item])
        .filter((item) => {
          if (!this.electionStatus || !item.status) return item;

          if (statusOnlyAllowed(this.electionStatus, item.status)) return item;
        });
    },
  },
});

export default manageElectionMixins;
