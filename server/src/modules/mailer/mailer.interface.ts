export type VoterCredentialsContextTemplate = {
  title: string;
  voterId: string;
  pin: string;
  election_date: string;
  election_link: string;
  firstname: string;
  lastname: string;
};

export type ThankYouForVotingContextTemplate = {
  title: string;
  firstname: string;
  lastname: string;
  election_title: string;
  election_end_date: string;
  election_result_link: string;
};

export type ElectionHasLaunchedTemplate = {
  title: string;
  election_title: string;
  election_end_date: string;
  election_start_date: string;
};

export type ElectionHasEndedTemplate = {
  title: string;
  election_title: string;
  election_end_date: string;
  election_result_link: string;
};
