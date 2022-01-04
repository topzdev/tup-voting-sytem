import Vue from "vue";
import { Election } from "../services/election.service";
import { Organization } from "../services/organization.service";

const manageElectionMixins = Vue.extend({
  computed: {
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

    sidebarLinks() {
      console.log(this.$route);

      const electionId = this.$route.params.electionId;
      const basePath = `/manage/election/${electionId}`;

      return [
        {
          icon: "mdi-view-dashboard",
          title: "Overview",
          to: `${basePath}/overview`,
          status: ["all"],
        },

        {
          icon: "mdi-chart-box-outline",
          title: "Results",
          to: `${basePath}/results`,
          status: ["running", "election"],
        },
        {
          icon: "mdi-account-group",
          title: "Party",
          to: `${basePath}/party`,
          status: ["all"],
        },
        {
          icon: "mdi-account-details",
          title: "Positions",
          to: `${basePath}/positions`,
          status: ["running", "election"],
        },
        {
          icon: "mdi-account-tie",
          title: "Candidates",
          to: `${basePath}/candidates`,
          status: ["all"],
        },
        {
          icon: "mdi-account-group",
          title: "Voters",
          to: `${basePath}/voters`,
          status: ["all"],
        },
        {
          icon: "mdi-cog",
          title: "Settings",
          to: `${basePath}/settings`,
          status: ["building"],
        },
        {
          icon: "mdi-rocket",
          title: "Launchpad",
          to: `${basePath}/launchpad`,
          status: ["building"],
        },
      ];
    },
  },
});

export default manageElectionMixins;
