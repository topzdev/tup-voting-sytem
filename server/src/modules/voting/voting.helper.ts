import shortid from "shortid";

export const VOTING_MESSAGES = {
  electionNotFound: "Election not found",
  electioNotExist: "Election is not exist",
  electionNotStarted: "Election is not yet started",
  electionClosed: "ELection is closed",
  alreadyVoted: "You already voted",
  voterNotFound: "Voter not found",
  ballotEmpty: "Ballot is empty",
  electionIdRequired: "Election ID is required",
  voterIdRequired: "Voter ID is required",
};

export const generateReceipt = (election_id: number) => {
  return `${election_id}-${shortid.generate()}`.toUpperCase();
};
