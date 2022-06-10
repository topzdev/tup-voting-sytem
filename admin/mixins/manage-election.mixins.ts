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
import pageConfig, { PageConfigItem } from "../configs/pages.config";

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

type ElectionPageLinks = Record<ElectionPages, PageConfigItem>;

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
      const electionRoutes = pageConfig.election(
        this.electionId as Election["id"]
      );

      return {
        overview: electionRoutes.this(),
        results: electionRoutes.results(),
        party: electionRoutes.party(),
        positions: electionRoutes.positions(),
        candidates: electionRoutes.candidates(),
        voters: electionRoutes.voters(),
        officers: electionRoutes.officers(),
        settings: electionRoutes.settings(),
        launchpad: electionRoutes.launchpad(),
      };
    },

    sidebarLinks(): PageConfigItem[] | null {
      return Object.keys(this.links)
        .map((item) => this.links[item])
        .filter((item) => {
          if (!this.electionStatus || !item.status) return item;

          if (statusOnlyAllowed(this.electionStatus, item.status)) return item;
        })
        .filter((item) => {
          if (!item.allowedRoles) return item;

          console.log(item.allowedRoles, this.rolesAllowed(item.allowedRoles));

          if (this.rolesAllowed(item.allowedRoles)) return item;
        });
    },
  },
});

export default manageElectionMixins;
