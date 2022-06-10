import { Candidate } from "../services/candidate.service";
import { Election } from "../services/election.service";
import { Organization } from "../services/organization.service";
import { Voters } from "../services/voters.service";
import { RolesString, UserRolesValue } from "../types/roles";
import icons from "./icons";
import pageRoles from "./page-roles";
import pageStatus from "./page-status.config";

export type PageConfigItem = {
  title: string;
  route: string;
  icon: string;
  allowedRoles: UserRolesValue[];
  to: string;
  status?: any[];
  exactPath?: string;
  show?: boolean;
  toolbarTitle?: string;
  roles?: any[];
};

const pageConfig = {
  dashboard: () => {
    return {
      this: () =>
        ({
          title: "Dashboard",
          route: "/",
          icon: "mdi-apps",
        } as PageConfigItem),
    };
  },
  settings: () => {
    const parentUrl = "/settings";
    return {
      this: () =>
        ({
          title: "Settings",
          icon: "mdi-cog",
          route: parentUrl,
        } as PageConfigItem),
    };
  },

  admin: () => {
    return {
      this: () =>
        ({
          route: "/admin",
          title: "Admin",
          icon: "mdi-shield-crown-outline",
          allowedRoles: ["sadmin"],
        } as PageConfigItem),
    };
  },
  election: (election_id: Election["id"]) => {
    const parentRoute = "/manage/election/" + election_id;

    return {
      this: () =>
        ({
          title: "Overview",
          route: parentRoute + "/overview",
          to: parentRoute + "/overview",
          icon: icons.overview,
        } as PageConfigItem),

      officers: () =>
        ({
          icon: icons.officers,
          title: "Officers",
          to: `${parentRoute}/officers`,
          route: `${parentRoute}/officers`,
          toolbarTitle: "Election Officers",
          allowedRoles: pageRoles.election.election_officer,
        } as PageConfigItem),

      results: () =>
        ({
          icon: icons.results,
          title: "Results",
          to: `${parentRoute}/results`,
          route: `${parentRoute}/results`,
          status: pageStatus.results,
        } as PageConfigItem),

      party: () =>
        ({
          icon: icons.party,
          title: "Party",
          to: `${parentRoute}/party`,
          route: `${parentRoute}/party`,
        } as PageConfigItem),

      positions: () =>
        ({
          icon: icons.positions,
          title: "Positions",
          to: `${parentRoute}/positions`,
          route: `${parentRoute}/positions`,
        } as PageConfigItem),

      candidates: () =>
        ({
          icon: icons.candidates,
          title: "Candidates",
          to: `${parentRoute}/candidates`,
          route: `${parentRoute}/candidates`,
        } as PageConfigItem),
      voters: () =>
        ({
          icon: icons.voters,
          title: "Voters",
          to: `${parentRoute}/voters`,
          route: `${parentRoute}/voters`,
        } as PageConfigItem),

      settings: () =>
        ({
          icon: icons.settings,
          title: "Settings",
          toolbarTitle: "Election Settings",
          to: `${parentRoute}/settings`,
          route: `${parentRoute}/settings`,
        } as PageConfigItem),

      launchpad: () =>
        ({
          icon: icons.launchpad,
          title: "Launchpad",
          to: `${parentRoute}/launchpad`,
          route: `${parentRoute}/launchpad`,
          toolbarTitle: "Launch Election",
          status: pageStatus.launchpad,
        } as PageConfigItem),
    };
  },

  organization: (organization_id?: Organization["id"]) => {
    const parentRoute = `/organization/${organization_id || ""}`;
    return {
      this: () =>
        ({
          route: parentRoute,
          icon: "vote-outline",
        } as PageConfigItem),
      create: () =>
        ({
          route: `${parentRoute}create`,
          icon: "",
        } as PageConfigItem),

      createElection: () =>
        ({
          route: `${parentRoute}/election/create`,
          icon: "",
        } as PageConfigItem),

      manageInfo: () =>
        ({
          title: "Organization Info",
          route: `${parentRoute}/manage/info/`,
          icon: "mdi-note-edit-outline",
        } as PageConfigItem),

      deleteOrganization: () =>
        ({
          title: "Remove Organization",
          route: `${parentRoute}/manage/remove`,
          icon: "mdi-delete",
        } as PageConfigItem),
    };
  },
  users: () => {
    const parentUrl = pageConfig.admin().this().route + "/user";

    return {
      this: () =>
        ({
          title: "User",
          icon: "mdi-account-supervisor-circle",
          route: `${parentUrl}/`,
        } as PageConfigItem),
      create: () =>
        ({
          title: "Create User",
          icon: "",
          route: `${parentUrl}/create`,
        } as PageConfigItem),
      general: (id: number) =>
        ({
          title: "User Information",
          icon: "mdi-account-outline",
          route: `${parentUrl}/${id}/general`,
        } as PageConfigItem),
      changeRole: (id: number) =>
        ({
          title: "Change Role",
          icon: "mdi-account-convert",
          route: `${parentUrl}/${id}/change-role`,
        } as PageConfigItem),
      resetPassword: (id: number) =>
        ({
          title: "Reset Password",
          icon: "mdi-lock-reset",
          route: `${parentUrl}/${id}/reset-password`,
        } as PageConfigItem),
      disableAccount: (id: number) =>
        ({
          title: "Enable or Disable Account",
          icon: "mdi-account-off",
          route: `${parentUrl}/${id}/able-account`,
        } as PageConfigItem),
      removeAccount: (id: number) =>
        ({
          title: "Remove Account",
          icon: "mdi-account-remove",
          route: `${parentUrl}/${id}/remove-account`,
        } as PageConfigItem),
    };
  },

  myaccount: () => {
    const parentUrl = `${pageConfig.settings().this().route}/my-account`;

    return {
      this: () => ({
        title: "My Account",
        icon: "mdi-account-circle-outline",
        route: parentUrl + "/",
        exact: true,
      }),
      changePassword: () => ({
        title: "Change Password",
        icon: "mdi-form-textbox-password",
        route: `${parentUrl}/change-password`,
      }),
    };
  },

  candidate: () => {
    const parentUrl = "candidates";

    return {
      this: () => ({
        title: "My Account",
        icon: "mdi-account-circle-outline",
        route: parentUrl + "/",
        exact: true,
      }),

      create: () => ({
        title: "Create Candidate",
        route: parentUrl + "/create",
      }),
      edit: (candidate_id: Candidate["id"]) => ({
        title: "Create Candidate",
        route: `${parentUrl}/${candidate_id}/edit`,
      }),
    };
  },

  voters: (election_id: Election["id"]) => {
    console.log("Election ID", election_id);
    const parentUrl = "/manage/election/" + election_id + "/voters";

    return {
      this: () =>
        ({
          route: parentUrl,
          title: "Voters",
        } as PageConfigItem),

      create: () =>
        ({
          route: parentUrl + "/create",
          title: "Create Voter",
        } as PageConfigItem),

      import: () =>
        ({
          route: parentUrl + "/import",
          title: "Import Voters",
        } as PageConfigItem),
      edit: (voter_id: Voters["id"]) =>
        ({
          route: `${parentUrl}/${voter_id}/edit`,
          title: "Edit Voter",
        } as PageConfigItem),
    };
  },
};

export default pageConfig;
