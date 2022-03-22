import express from "express";
import { voterAuth } from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validate.middleware";
import resultsController from "./results.controller";
import resultsValidator from "./results.validator";
const router = express.Router();

console.log("module: Results Module Loaded");

router.get(
  "/election/id/:election_id",
  voterAuth,
  validate(resultsValidator.getElectionById),
  resultsController.getElectionById
);

const resultsRoute = router;

export default resultsRoute;
