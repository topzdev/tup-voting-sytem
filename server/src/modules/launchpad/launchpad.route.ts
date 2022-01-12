import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validate.middleware";
import launchpadController from "./launchpad.controller";
import launchpadValidator from "./launchpad.validator";
const router = express.Router();

console.log("module: Launchpad Module Loaded");

router.get(
  "/detail/:election_id",
  adminAuth,
  validate(launchpadValidator.getElectionDetails),
  launchpadController.getElectionDetails
);

router.get(
  "/ballot/:election_id",
  adminAuth,
  validate(launchpadValidator.getElectionBallot),
  launchpadController.getElectionBallot
);

router.get(
  "/election/:election_id",
  adminAuth,
  validate(launchpadValidator.getElectionById),
  launchpadController.getElectionById
);

router.get(
  "/election/all/:organization_id",
  adminAuth,
  validate(launchpadValidator.getAllElection),
  launchpadController.getAllElection
);

router.post(
  "/launch/:election_id",
  adminAuth,
  validate(launchpadValidator.launchElection),
  launchpadController.launchElection
);

const launchpadRoute = router;

export default launchpadRoute;
