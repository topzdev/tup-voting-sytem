import { statusOnlyAllowed } from "@/helpers/isAllowedByStatus.helper";
import {
  Election,
  ElectionStatus,
  ElectionWithUrl,
} from "@/services/election.service";
import { Organization } from "@/services/organization.service";
import Vue from "vue";
import pageStatus from "@/configs/page-status.config";
import icons from "../configs/icons";
import pageRoles from "../configs/page-roles";
import { rolesOnlyAllowed } from "../helpers/roles-allowed.helper";
import mixins from "vue-typed-mixins";
import roleRestrictionsMixin from "./roles-restriction.mixin";
import { IdToken } from "@nuxtjs/auth-next";

type ManageElectionPage = {
  icon: string;
  title: string;
  to: string;
  status?: any[];
  exactPath?: string;
  show?: boolean;
  toolbarTitle?: string;
  roles?: any[];
};
type ElectionPages =
  | "overview"
  | "results"
  | "candidates"
  | "party"
  | "positions"
  | "voters"
  | "settings"
  | "launchpad"
  | "officers";
// | "extra";

type ElectionPageLinks = Record<ElectionPages, ManageElectionPage>;

const manageElectionMixins = mixins(roleRestrictionsMixin).extend({
  computed: {
    manageElectionRoute(): string {
      if (!this.electionId) return "/";

      return `/manage/election/${this.electionId}`;
    },

    electionId(): Election["id"] | null {
      return this.electionInfo ? this.electionInfo.id : null;
    },

    electionInfo(): ElectionWithUrl | null {
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
          icon: icons.overview,
          title: "Overview",
          to: `${basePath}/overview`,
        },

        results: {
          icon: icons.results,
          title: "Results",
          to: `${basePath}/results`,
          status: pageStatus.results,
        },

        party: {
          icon: icons.party,
          title: "Party",
          to: `${basePath}/party`,
        },

        positions: {
          icon: icons.positions,
          title: "Positions",
          to: `${basePath}/positions`,
        },

        candidates: {
          icon: icons.candidates,
          title: "Candidates",
          to: `${basePath}/candidates`,
        },

        voters: {
          icon: icons.voters,
          title: "Voters",
          to: `${basePath}/voters`,
        },

        officers: {
          icon: icons.officers,
          title: "Officers",
          to: `${basePath}/officers`,
          toolbarTitle: "Election Officers",
          roles: pageRoles.election.election_officer,
        },

        settings: {
          icon: icons.settings,
          title: "Settings",
          toolbarTitle: "Election Settings",
          to: `${basePath}/settings`,
        },

        launchpad: {
          icon: icons.launchpad,
          title: "Launchpad",
          to: `${basePath}/launchpad`,
          toolbarTitle: "Launch Election",
          status: pageStatus.launchpad,
        },

        // extra: {
        //   icon: icons.development,
        //   title: "Development",
        //   toolbarTitle: "Development Extra",
        //   to: `${basePath}/extra`,
        // },
      };
    },

    sidebarLinks(): ManageElectionPage[] {
      return Object.keys(this.links)
        .map((item) => this.links[item])
        .filter((item) => {
          if (!this.electionStatus || !item.status) return item;

          if (statusOnlyAllowed(this.electionStatus, item.status)) return item;
        })
        .filter((item) => {
          if (!item.roles) return item;

          if (this.rolesAllowed(item.roles)) return item;
        });
    },
  },
});

export default manageElectionMixins;
