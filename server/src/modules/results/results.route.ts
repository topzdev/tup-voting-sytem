import express from "express";
import { voterAuth } from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validate.middleware";
import resultsController from "./results.controller";
import resultsValidator from "./results.validator";
const router = express.Router();

console.log("module: Results Module Loaded");

router.get(
  "/final-results/:election_id",
  // voterAuth,
  // // validate(resultsValidator.getElectionBySlug),
  resultsController.getElectionResults
);

router.get(
  "/winners/:election_id",
  // voterAuth,
  // // validate(resultsValidator.getElectionBySlug),
  resultsController.getElectionWinners
);

router.get(
  "/export-results/:election_id",
  // voterAuth,
  // // validate(resultsValidator.getElectionBySlug),
  resultsController.downloadElectionResults
);

router.get(
  "/export-vote-audit/:election_id",
  // voterAuth,
  // // validate(resultsValidator.getElectionBySlug),
  resultsController.downloadVoteAudit
);

const resultsRoute = router;

export default resultsRoute;
