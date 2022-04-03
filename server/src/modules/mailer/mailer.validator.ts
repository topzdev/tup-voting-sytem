import { body, param } from "express-validator";

// docs: https://express-validator.github.io/docs/index.html

const validations = {
  election_id: body("election_id")
    .notEmpty()
    .withMessage("Election ID is required"),
  voter_id: body("voter_id").notEmpty().withMessage("Voter ID is required"),
  voters_ids: body("voters_ids")
    .notEmpty()
    .withMessage("Voter ID's is required"),
  election_ids: body("election_ids")
    .notEmpty()
    .withMessage("Election ID's is required"),
};

const { election_id, voters_ids, election_ids, voter_id } = validations;

const sendVotersCredentialsEmail = [election_id, voters_ids];
const sendThankYouForVotingEmail = [voter_id];
const sendElectionHasLaunched = [election_ids];
const sendElectionHasEnded = [election_ids];

const mailerValidator = {
  sendVotersCredentialsEmail,
  sendThankYouForVotingEmail,
  sendElectionHasLaunched,
  sendElectionHasEnded,
};

export default mailerValidator;
