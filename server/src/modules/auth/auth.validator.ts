import { body } from "express-validator";

// docs: https://express-validator.github.io/docs/index.html

const validations = {
  username: body("username").notEmpty().withMessage("Username is required"),
  password: body("password").notEmpty().withMessage("Password is required"),
  usernameOrEmail: body("usernameOrEmail")
    .notEmpty()
    .withMessage("Username or email address is required"),
  voter_id: body("voter_id").notEmpty().withMessage("Voter Id is required"),
  pin: body("pin").notEmpty().withMessage("Pin is required"),
  election_id: body("election_id")
    .notEmpty()
    .withMessage("Election ID is required"),
};

const { username, password, election_id, voter_id, pin, usernameOrEmail } =
  validations;

const adminLogin = [username, password];
const voterLogin = [election_id, voter_id, pin];
const systemLogin = [usernameOrEmail, password];

const authValidator = {
  adminLogin,
  voterLogin,
  systemLogin,
};

export default authValidator;
