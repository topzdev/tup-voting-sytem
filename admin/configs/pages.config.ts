const pageConfig = {
  settings: () => {
    return "/settings";
  },
  users: () => {
    const parentUrl = pageConfig.settings() + "/user";

    return {
      this: () => `${parentUrl}/`,
      create: () => `${parentUrl}/create`,
      general: (id: number) => `${parentUrl}/${id}/general`,
      resetPassword: (id: number) => `${parentUrl}/${id}/reset-password`,
      disableAccount: (id: number) => `${parentUrl}/${id}/disable-account`,
    };
  },
};

export default pageConfig;
