import { body, param } from "express-validator";

// docs: https://express-validator.github.io/docs/index.html

const validations = {
  param_slug: param("slug").notEmpty().withMessage("Election Slug is required"),
  email_address: body("email_address")
    .notEmpty()
    .withMessage("Email address is required"),
  firstname: param("firstname")
    .notEmpty()
    .withMessage("First name is required"),
  code: body("code").notEmpty().withMessage("Code is required"),
  lastname: param("lastname").notEmpty().withMessage("Last name is required"),
  google_id: param("google_id").notEmpty().withMessage("Google ID is required"),
  election_id: body("election_id")
    .notEmpty()
    .withMessage("Election ID is required")
    .toInt(),
};

const {
  param_slug,
  election_id,
  firstname,
  lastname,
  code,
  google_id,
  email_address,
} = validations;

const getElection = [param_slug];

const getVoterInfo = [code];

const isRegistered = [email_address, election_id];

const preRegisterVoter = [
  firstname,
  lastname,
  email_address,
  google_id,
  election_id,
];

const preregisterValidator = {
  getElection,
  getVoterInfo,
  isRegistered,
  preRegisterVoter,
};

export default preregisterValidator;
