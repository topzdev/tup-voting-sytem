import { body, param } from "express-validator";

// docs: https://express-validator.github.io/docs/index.html

const validations = {
  // id: body("id").notEmpty().withMessage("ID is required"),
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
  title: body("title").notEmpty().withMessage("Title is required"),
  start_date: body("start_date")
    .notEmpty()
    .withMessage("Start Date is required"),

  close_date: body("start_date")
    .notEmpty()
    .withMessage("Start Date is required"),

  is_public: body("is_public").notEmpty().withMessage("Is Public is required"),
  is_tally_public: body("is_tally_public")
    .notEmpty()
    .withMessage("Is Public is required"),
};

const { title, close_date, start_date, is_public, is_tally_public } =
  validations;

const updateGeneral = [title];
const updateDate = [start_date, close_date];

const settingsValidator = {
  updateGeneral,
  updateDate,
};

export default settingsValidator;
