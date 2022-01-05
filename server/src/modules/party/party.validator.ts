import { body } from "express-validator";

// docs: https://express-validator.github.io/docs/index.html

const validations = {
  id: body("id").notEmpty().withMessage("ID is required"),
  // slug: body("slug")
  //   .notEmpty()
  //   .withMessage("Slug is required")
  //   .not()
  //   .contains(" ")
  //   .withMessage("Slug must not contain space")
  //   .isLowercase()
  //   .withMessage("Slug must be lowercase")
  //   .not()
  //   .matches(/[ `!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~\.\*\\\t\n\r]+/)
  //   .withMessage("Slug must not contain number and special characters"),
  title: body("title").notEmpty().withMessage("Title is required"),
  election_id: body("election_id")
    .notEmpty()
    .withMessage("election is required"),
};

const { id, title, election_id,  } =
  validations;

const create = [ title, election_id, ];
const update = [id, title, election_id];

const partyValidator = {
  create,
  update,
};

export default partyValidator;