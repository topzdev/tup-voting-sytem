import { body } from "express-validator";

// docs: https://express-validator.github.io/docs/index.html

const validations = {
  id: body("id").notEmpty().withMessage("ID is required"),
  slug: body("slug")
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
  ticker: body("ticker").notEmpty().withMessage("Ticker is required"),
  title: body("title").notEmpty().withMessage("Title is required"),
};

const { id, slug, title, ticker } = validations;

const create = [title, ticker];
const update = [id, , title, ticker];

const organizationValidator = {
  create,
  update,
};

export default organizationValidator;
