const pageConfig = {
  dashboard: () => {
    return {
      this: () => ({ title: "Dashboard", route: "/", icon: "mdi-apps" }),
    };
  },
  settings: () => {
    return {
      this: () => ({ title: "Settings", icon: "mdi-cog", route: "/settings" }),
    };
  },
  admin: () => {
    return {
      this: () => ({
        route: "/admin",
        title: "Admin",
        icon: "mdi-shield-crown-outline",
      }),
    };
  },
  election: () => {
    return {
      this: () => ({
        route: "/election",
        icon: "",
      }),
    };
  },
  organization: () => {
    return {
      this: () => ({
        route: "/organization",
        icon: "",
      }),
    };
  },
  users: () => {
    const parentUrl = pageConfig.admin().this().route + "/user";

    return {
      this: () => ({
        title: "User",
        icon: "mdi-account-supervisor-circle",
        route: `${parentUrl}/`,
      }),
      create: () => ({
        title: "Create User",
        icon: "",
        route: `${parentUrl}/create`,
      }),
      general: (id: number) => ({
        title: "User Information",
        icon: "mdi-account-outline",
        route: `${parentUrl}/${id}/general`,
      }),
      changeRole: (id: number) => ({
        title: "Change Role",
        icon: "mdi-account-convert",
        route: `${parentUrl}/${id}/change-role`,
      }),
      resetPassword: (id: number) => ({
        title: "Reset Password",
        icon: "mdi-lock-reset",
        route: `${parentUrl}/${id}/reset-password`,
      }),
      disableAccount: (id: number) => ({
        title: "Enable or Disable Account",
        icon: "mdi-account-off",
        route: `${parentUrl}/${id}/able-account`,
      }),
      removeAccount: (id: number) => ({
        title: "Remove Account",
        icon: "mdi-account-remove",
        route: `${parentUrl}/${id}/remove-account`,
      }),
    };
  },

  myaccount: () => {
    return {
      this: () => ({}),
    };
  },
};

export default pageConfig;
