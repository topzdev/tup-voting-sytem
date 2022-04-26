export const SECURITY_MESSAGE = {
  youHaveOnlyAttemps: (leftAttempts: number) => {
    return `You have only ${leftAttempts} attempts or your account will be temporary locked.`;
  },
  attemptsAccountLock: () => {
    return "You account was locked after too many failed attempts. To re-activate your account please contact your administrator.";
  },

  userNotFound: () => {
    return "User not found";
  },
};
