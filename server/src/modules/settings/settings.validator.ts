import { body, param } from "express-validator";

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
  title: body("title").notEmpty().withMessage("Title is required"),
  organization_id: body("organization_id")
    .notEmpty()
    .withMessage("Organization is required"),
  start_date: body("start_date")
    .notEmpty()
    .withMessage("Start Date is required"),

  close_date: body("start_date")
    .notEmpty()
    .withMessage("Start Date is required"),
};

const { id, slug, title, organization_id, close_date, start_date } =
  validations;

const create = [slug, title, organization_id, close_date, start_date];
const update = [id, slug, title, close_date, start_date, organization_id];

const settingsValidator = {
  create,
  update,
};

export default settingsValidator;
