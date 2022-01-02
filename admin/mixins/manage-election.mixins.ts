import Vue from "vue";

const manageElectionMixins = Vue.extend({
  computed: {
    electionInfo() {
      return this.$accessor.manageElection.election;
    },

    electionOrganizationInfo() {
      return this.$accessor.manageElection.organization;
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
