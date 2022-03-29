import { customAlphabet } from "nanoid";
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

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nanoid = customAlphabet(alphabet, 10);

export const generateReceipt = (election: Election) => {
  return `${configs.ballotReceiptPreWord}-${
    election.id
  }-${nanoid()}`.toUpperCase();
};

export const generateBallotError = (election: Election) => {
  let error: ElectionErrorMessage;
  // Start - Election with Final Tally Results Public Module - CL -
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
  } else if (
    election.final_status === "completed" ||
    election.final_status === "archived"
  ) {
    error = VOTING_MESSAGES.electionClosed;
  }
  // End - Election with Final Tally Results Public Module

  return error;
};
