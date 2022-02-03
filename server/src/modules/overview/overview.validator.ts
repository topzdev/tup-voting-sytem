import { body, param } from "express-validator";

// docs: https://express-validator.github.io/docs/index.html

const validations = {
  param_election_id: param("election_id")
    .notEmpty()
    .withMessage("Election ID is required"),
//   param_organization_id: param("organization_id")
//     .notEmpty()
//     .withMessage("Organization ID is required"),
};

const { param_election_id, } = validations;

const getElectionDetails = [param_election_id];

const launchpadValidator = {
  getElectionDetails,
};

export default launchpadValidator;
