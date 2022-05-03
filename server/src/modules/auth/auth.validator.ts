import { body } from "express-validator";

// docs: https://express-validator.github.io/docs/index.html

const validations = {
  user_id: body("user_id").notEmpty().withMessage("User ID is required"),
  otp: body("otp").notEmpty().withMessage("OTP is required"),
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

const {
  user_id,
  otp,
  username,
  password,
  election_id,
  voter_id,
  pin,
  usernameOrEmail,
} = validations;

const adminLogin = [usernameOrEmail, password];
const voterLogin = [election_id, voter_id, pin];
const systemLogin = [usernameOrEmail, password];
const adminVerifyLoginOTP = [user_id, otp];

const authValidator = {
  adminLogin,
  voterLogin,
  systemLogin,
  adminVerifyLoginOTP,
};

export default authValidator;
