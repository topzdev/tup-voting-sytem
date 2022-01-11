import { body } from "express-validator";

// docs: https://express-validator.github.io/docs/index.html

const validations = {
  id: body("id").notEmpty().withMessage("ID is required"),
  firstname: body("firstname").notEmpty().withMessage("First Name is required"),
  lastname: body("lastname").notEmpty().withMessage("Last Name is required"),
  // party_id: body("party_id").notEmpty().withMessage("Party is required"),
  position_id: body("position_id")
    .notEmpty()
    .withMessage("Position is required"),
};

const { id, firstname, lastname, position_id } = validations;

const create = [firstname, lastname, position_id];
const update = [id, firstname, lastname, position_id];

const launchpadValidator = {
  create,
  update,
};

export default launchpadValidator;
