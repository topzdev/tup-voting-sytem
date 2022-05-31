import { body } from "express-validator";

// docs: https://express-validator.github.io/docs/index.html

const validations = {
  id: body("id").notEmpty().withMessage("Id is required"),
  organization_id: body("organization_id")
    .notEmpty()
    .withMessage("Organization Id is required"),
  firstname: body("firstname").notEmpty().withMessage("Firstname is required"),
  lastname: body("lastname").notEmpty().withMessage("Lastname is required"),
  username: body("username").notEmpty().withMessage("Username is required"),

  password: body("password").notEmpty().withMessage("Password is required"),

  email_address: body("email_address")
    .notEmpty()
    .withMessage("Email Address is required"),
  role: body("role").notEmpty().withMessage("Role is required"),
  newPassword: body("newPassword")
    .notEmpty()
    .withMessage("New Password is required"),
  currentPassword: body("currentPassword")
    .notEmpty()
    .withMessage("Current Password is required"),
  confirmPassword: body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required"),
};

const { id, firstname, lastname, username, email_address, organization_id } =
  validations;

const create = [firstname, lastname, username, email_address, organization_id];
const update = [id, firstname, lastname, email_address];

const userValidator = {
  create,
  update,
};

export default userValidator;
