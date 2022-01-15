import { body, param } from "express-validator";

// docs: https://express-validator.github.io/docs/index.html

const validations = {
  param_election_id: param("election_id")
    .notEmpty()
    .withMessage("Election ID is required"),
  param_organization_id: param("organization_id")
    .notEmpty()
    .withMessage("Organization ID is required"),
};

const { param_election_id, param_organization_id } = validations;

const getElectionBallot = [param_election_id];
const getElectionDetails = [param_election_id];
const launchElection = [param_election_id];
const getAllElection = [param_organization_id];
const getElectionById = [param_election_id];
const getLaunchpadValidors = [param_election_id];

const launchpadValidator = {
  getElectionBallot,
  getElectionDetails,
  launchElection,
  getAllElection,
  getElectionById,
  getLaunchpadValidors,
};

export default launchpadValidator;
