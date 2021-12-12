"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
// docs: https://express-validator.github.io/docs/index.html
const validations = {
    id: (0, express_validator_1.body)("id").notEmpty().withMessage("ID is required"),
    slug: (0, express_validator_1.body)("slug")
        .notEmpty()
        .withMessage("Slug is required")
        .not()
        .contains(" ")
        .withMessage("Slug must not contain space")
        .isLowercase()
        .withMessage("Slug must be lowercase")
        .not()
        .matches(/[ `!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~\.\*\\\t\n\r]+/)
        .withMessage("Slug must not contain number and special characters"),
    ticker: (0, express_validator_1.body)("ticker").notEmpty().withMessage("Ticker is required"),
    title: (0, express_validator_1.body)("title").notEmpty().withMessage("Title is required"),
};
const { id, slug, title, ticker } = validations;
const create = [slug, title, ticker];
const update = [id, slug, title, ticker];
const organizationValidator = {
    create,
    update,
};
exports.default = organizationValidator;
//# sourceMappingURL=organization.validator.js.map