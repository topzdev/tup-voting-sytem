export type EmailTemplates =
  | "voter-credentials"
  | "election-has-ended"
  | "election-has-launched"
  | "thank-you-for-voting";

const from = "TUP Voting admin@tupvoting.com";

export const emailTemplates = {
  voterCredentails: {
    from,
    subject: "Your voters credentails",
    template: "voter-credentials" as EmailTemplates,
    title: "Your $electionTitle Voter Credentails",
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
};
