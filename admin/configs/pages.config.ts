import { Election } from "../services/election.service";
import { Organization } from "../services/organization.service";
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
  election: () => {
    return {
      this: () =>
        ({
          route: "/election",
          icon: "",
        } as PageConfigItem),
    };
  },

  overview: () => {
    return {
      this: (election_id: Election["id"]) => {
        return `/manage/election/${election_id}/overview/`;
      },
    };
  },

  organization: () => {
    return {
      this: (organization_id: Organization["id"]) =>
        ({
          route: `/organization/${organization_id}`,
          icon: "",
        } as PageConfigItem),

      edit: (organization_id: Organization["id"]) =>
        ({
          route: `/manage/organization/${organization_id}`,
          icon: "",
        } as PageConfigItem),

      create: () =>
        ({
          route: `/manage/organization/create`,
          icon: "",
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
};

export default pageConfig;
