import { max, min } from "class-validator";
import { body } from "express-validator";

// docs: https://express-validator.github.io/docs/index.html

const validations = {
  id: body("id").notEmpty().withMessage("ID is required"),
  election_id: body("election_id")
    .notEmpty()
    .withMessage("Election is required"),
  title: body("title").notEmpty().withMessage("Title is required"),
  min_selected: body("min_selected")
    .notEmpty()
    .withMessage("Minimum selected is required")
    .isInt({
      gt: 0,
    })
    .withMessage("minimum selected should be greater than 0"),
  max_selected: body("max_selected")
    .notEmpty()
    .withMessage("Maximum selected is required")
    .isInt({
      gt: 0,
    })
    .withMessage("maximum selected should be greater than 0"),
};

const { id, title, max_selected, min_selected } = validations;

const create = [title, min_selected, max_selected];
const update = [id, title, min_selected, max_selected];

const positionValidator = {
  create,
  update,
};

export default positionValidator;
