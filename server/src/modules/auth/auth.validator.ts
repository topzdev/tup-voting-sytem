import { body } from "express-validator";

// docs: https://express-validator.github.io/docs/index.html

const validations = {
  username: body("username").notEmpty().withMessage("Username is required"),
  password: body("password").notEmpty().withMessage("Password is required"),

  voter_id: body("voter_id").notEmpty().withMessage("Voter Id is required"),
  pin: body("pin").notEmpty().withMessage("Pin is required"),
  election_id: body("election_id")
    .notEmpty()
    .withMessage("Election ID is required"),
};

const { username, password, election_id, voter_id, pin } = validations;

const adminLogin = [username, password];
const voterLogin = [election_id, voter_id, pin];

const authValidator = {
  adminLogin,
  voterLogin,
};

export default authValidator;
