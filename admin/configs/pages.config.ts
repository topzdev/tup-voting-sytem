import { Candidate } from "../services/candidate.service";
import { Election } from "../services/election.service";
import { Organization } from "../services/organization.service";
import { Voters } from "../services/voters.service";
import { RolesString } from "../types/roles";

type PageConfigItem = {
  title: string;
  route: string;
  icon: string;
  allowedRoles?: RolesString[];
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
          allowedRoles: ["SUPER_ADMIN"],
        } as PageConfigItem),
    };
  },
  election: (election_id: Election["id"]) => {
    const parentRoute = "/manage/election/" + election_id;

    return {
      this: () =>
        ({
          route: parentRoute + "/overview",
          icon: "",
        } as PageConfigItem),

      officers: () =>
        ({
          title: "Election Officers",
          route: `${parentRoute}/officers`,
          icon: "mdi-account-tie-outline",
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
