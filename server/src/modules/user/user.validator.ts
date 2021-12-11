import { body } from "express-validator";

// docs: https://express-validator.github.io/docs/index.html

const validations = {
  id: body("id").notEmpty().withMessage("Id is required"),
  firstname: body("firstname").notEmpty().withMessage("Firstname is required"),
  lastname: body("lastname").notEmpty().withMessage("Lastname is required"),
  username: body("username").notEmpty().withMessage("Username is required"),
  password: body("password").notEmpty().withMessage("Password is required"),
  role: body("role").notEmpty().withMessage("Role is required"),
};

const { id, firstname, lastname, username, password, role } = validations;

const create = [firstname, lastname, username, password, role];
const update = [id, firstname, lastname, role];

const userValidator = {
  create,
  update,
};

export default userValidator;
