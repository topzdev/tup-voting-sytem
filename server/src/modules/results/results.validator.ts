import { body, param } from "express-validator";

// docs: https://express-validator.github.io/docs/index.html

const validations = {
  param_slug: param("slug").notEmpty().withMessage("Election Slug is required"),

  username: body("username").notEmpty().withMessage("Username is required"),
  election_id: body("election_id")
    .notEmpty()
    .withMessage("Election ID is required")
    .toInt(),
};

const { param_slug, election_id } = validations;

const getElectionBySlug = [param_slug];

const resultsValidator = {
  getElectionBySlug,
};

export default resultsValidator;
