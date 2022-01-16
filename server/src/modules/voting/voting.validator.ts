import { body, param } from "express-validator";

// docs: https://express-validator.github.io/docs/index.html

const validations = {
  param_election_id: param("election_id")
    .notEmpty()
    .withMessage("Election ID is required")
    .toInt(),
  param_candidate_id: param("candidate_id")
    .notEmpty()
    .withMessage("Candidate ID is required")
    .toInt(),

  username: body("username").notEmpty().withMessage("Username is required"),
  password: body("password").notEmpty().withMessage("Password is required"),
  election_id: body("election_id")
    .notEmpty()
    .withMessage("Election ID is required")
    .toInt(),
};

const {
  param_election_id,
  param_candidate_id,
  election_id,
  username,
  password,
} = validations;

const loginVoter = [election_id, username, password];
const loginVoterWithGoogle = [];
const getElectionById = [param_election_id];
const getElectionBallot = [param_election_id];
const getCandidateInfo = [param_candidate_id];
const submitBallot = [election_id];

const votingValidator = {
  getElectionById,
  getElectionBallot,
  getCandidateInfo,
  submitBallot,
  loginVoter,
  loginVoterWithGoogle,
};

export default votingValidator;
