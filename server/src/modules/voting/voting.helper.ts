import shortid from "shortid";
import configs from "../../configs";
import { Election } from "../election/entity/election.entity";

type ElectionErrorMessage = {
  title: string;
  body: string;
};

export const VOTING_MESSAGES = {
  electionNotFound: {
    title: "Election not found",
    body: "The election is not available or not created yet",
  },
  electioNotExist: {
    title: "Election is not exist",
    body: "",
  },
  electionNotStarted: { title: "Election is not yet started", body: "" },
  electionClosed: { title: "Election is closed", body: "" },
  alreadyVoted: { title: "You already voted", body: "" },
  voterNotFound: { title: "Voter not found", body: "" },
  ballotEmpty: { title: "Ballot is empty", body: "" },
  electionIdRequired: { title: "Election ID is required", body: "" },
  voterIdRequired: { title: "Voter ID is required", body: "" },
};

export const generateReceipt = (election: Election) => {
  return `${configs.ballotReceiptPreWord}-${
    election.id
  }-${shortid.generate()}`.toUpperCase();
};

export const generateBallotError = (election: Election) => {
  let error: ElectionErrorMessage;

  // check if elexction exist or is in building status
  if (!election || election.final_status === "building") {
    error = VOTING_MESSAGES.electionNotFound;

    // check if election is running
  } else if (election.final_status === "running") {
    // check if the start date is past with the current date
    if (new Date().getTime() <= new Date(election.start_date).getTime()) {
      error = VOTING_MESSAGES.electionNotStarted;
    }

    // check if the election is completed or close
  } else if (election.final_status === "completed") {
    error = VOTING_MESSAGES.electionClosed;
  }

  return error;
};
