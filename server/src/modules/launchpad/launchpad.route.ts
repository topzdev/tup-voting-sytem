import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import rolesAllowed from "../../middlewares/roles-allowed.middleware";
import validate from "../../middlewares/validate.middleware";
import launchpadController from "./launchpad.controller";
import launchpadValidator from "./launchpad.validator";
const router = express.Router();

console.log("module: Launchpad Module Loaded");

router.get(
  "/detail/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  validate(launchpadValidator.getElectionDetails),
  launchpadController.getElectionDetails
);

router.get(
  "/validations/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  validate(launchpadValidator.getLaunchpadValidors),
  launchpadController.getElectionValidations
);

router.get(
  "/ballot/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  validate(launchpadValidator.getElectionBallot),
  launchpadController.getElectionBallot
);

router.get(
  "/election/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  validate(launchpadValidator.getElectionById),
  launchpadController.getElectionById
);

router.get(
  "/election/all/:organization_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  validate(launchpadValidator.getAllElection),
  launchpadController.getAllElection
);

router.post(
  "/launch/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  validate(launchpadValidator.launchElection),
  launchpadController.launchElection
);

const launchpadRoute = router;

export default launchpadRoute;
