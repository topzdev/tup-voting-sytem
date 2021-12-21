import { body } from "express-validator";

// docs: https://express-validator.github.io/docs/index.html

const validations = {
  id: body("id").notEmpty().withMessage("ID is required"),
  firstname: body("firstname").notEmpty().withMessage("First Name is required"),
  lastname: body("lastname").notEmpty().withMessage("Last Name is required"),
  party_id: body("party_id").notEmpty().withMessage("Party is required"),
  position_id: body("position_id")
    .notEmpty()
    .withMessage("Position is required"),
  election_id: body("election_id")
    .notEmpty()
    .withMessage("Election is required"),
};

const { id, firstname, lastname, party_id, position_id, election_id } =
  validations;

const create = [firstname, lastname, party_id, position_id, election_id];
const update = [id, firstname, lastname, party_id, position_id, election_id];

const candidateValidator = {
  create,
  update,
};

export default candidateValidator;
