import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validate.middleware";
import resultsController from "./results.controller";
import resultsValidator from "./results.validator";
const router = express.Router();

console.log("module: Results Module Loaded");

router.get(
  "/final-results/:election_id",
  adminAuth,
  resultsController.getElectionResults
);

router.get(
  "/winners/:election_id",
  adminAuth,
  resultsController.getElectionWinners
);

router.get(
  "/export-results/:election_id",
  adminAuth,
  resultsController.downloadElectionResults
);

router.get(
  "/export-vote-audit/:election_id",
  adminAuth,
  resultsController.downloadVoteAudit
);

router.post("/resolve-tie", adminAuth, resultsController.resolveTie);

router.post("/reset-tie", adminAuth, resultsController.resetTie);

router.post("/publish", adminAuth, resultsController.publishResult);

router.post("/un-publish", adminAuth, resultsController.unPublishResult);

const resultsRoute = router;

export default resultsRoute;
