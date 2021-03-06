export type EmailTemplates =
  | "voter-credentials"
  | "election-has-ended"
  | "election-has-launched"
  | "thank-you-for-voting"
  | "login-otp-verifcation"
  | "preregister-approved"
  | "election-will-launch";

const from = "TUP Voting System system@tupvote.com";

export const emailTemplates = {
  voterCredentails: {
    from,
    subject: "Your voters credentials",
    template: "voter-credentials" as EmailTemplates,
    title: "Your $electionTitle Voter Credentials",
  },
  thankYouForVoting: {
    from,
    subject: "Thank you for voting!",
    template: "thank-you-for-voting" as EmailTemplates,
    title: "Your vote on $electionTitle Submitted!",
  },
  electionHasLaunched: {
    from,
    subject: "Election has launched",
    template: "election-has-launched" as EmailTemplates,
    title: "$electionTitle has launched",
  },
  electionHasEnded: {
    from,
    subject: "Election has ended",
    template: "election-has-ended" as EmailTemplates,
    title: "$electionTitle has ended",
  },
  sendAdminLoginOTP: {
    from,
    subject: "OTP Verification sent",
    template: "login-otp-verifcation" as EmailTemplates,
    title: "Login Security Verifcation",
  },
  preRegisterApproved: {
    from,
    subject: "Pre-Registration Approved",
    template: "preregister-approved" as EmailTemplates,
    title: (title) => `You're Pre-Registration on ${title} is approved`,
  },
  electionWillStart: {
    from,
    subject: "Election will start",
    template: "election-will-start" as EmailTemplates,
    title: (title) => `The election ${title} will start`,
  },
};

export const formatDateTime = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    month: "long",
    year: "numeric",
    day: "numeric",
  });
};

const mailerHelper = {
  formatDateTime,
};

export default mailerHelper;
