"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
// docs: https://express-validator.github.io/docs/index.html
const validations = {
    id: (0, express_validator_1.body)("id").notEmpty().withMessage("Id is required"),
    firstname: (0, express_validator_1.body)("firstname").notEmpty().withMessage("Firstname is required"),
    lastname: (0, express_validator_1.body)("lastname").notEmpty().withMessage("Lastname is required"),
    username: (0, express_validator_1.body)("username").notEmpty().withMessage("Username is required"),
    password: (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
    role: (0, express_validator_1.body)("role").notEmpty().withMessage("Role is required"),
};
const { id, firstname, lastname, username, password, role } = validations;
const create = [firstname, lastname, username, password, role];
const update = [id, firstname, lastname, role];
const userValidator = {
    create,
    update,
};
exports.default = userValidator;
//# sourceMappingURL=user.validator.js.map