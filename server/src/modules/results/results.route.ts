import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import rolesAllowed from "../../middlewares/roles-allowed.middleware";
import validate from "../../middlewares/validate.middleware";
import resultsController from "./results.controller";
import resultsValidator from "./results.validator";
const router = express.Router();

console.log("module: Results Module Loaded");

router.get(
  "/final-results/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  resultsController.getElectionResults
);

router.get(
  "/winners/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  resultsController.getElectionWinners
);

router.get(
  "/export-results/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  resultsController.downloadElectionResults
);

router.get(
  "/export-vote-audit/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  resultsController.downloadVoteAudit
);

router.post(
  "/resolve-tie",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  resultsController.resolveTie
);

router.post(
  "/reset-tie",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  resultsController.resetTie
);

router.post(
  "/publish",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  resultsController.publishResult
);

router.post(
  "/un-publish",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  resultsController.unPublishResult
);

const resultsRoute = router;

export default resultsRoute;
