import { body } from "express-validator";

// docs: https://express-validator.github.io/docs/index.html

const validations = {
  id: body("id").notEmpty().withMessage("ID is required").toInt(),
  firstname: body("firstname").notEmpty().withMessage("Firstname is required"),
  lastname: body("lastname").notEmpty().withMessage("Lastname is required"),
  username: body("username").notEmpty().withMessage("Voter ID is required"),
  pin: body("pin").notEmpty().withMessage("PIN is required"),

  election_id: body("election_id")
    .notEmpty()
    .withMessage("Election ID is required"),
};

const { id, firstname, lastname, username, pin, election_id } = validations;

const create = [firstname, lastname, username, pin, election_id];
const update = [id, firstname, lastname, username, pin];

const voterValidator = {
  create,
  update,
};

export default voterValidator;
