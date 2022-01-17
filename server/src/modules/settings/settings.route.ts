import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validate.middleware";
import settingsController from "./settings.controller";
import settingsValidator from "./settings.validator";
const router = express.Router();

console.log("module: Settings Module Loaded");

// router.get(
//   "/detail/:election_id",
//   adminAuth,
//   validate(settingsValidator.getElectionDetails),
//   settingsController.getElectionDetails
// );

// router.get(
//   "/validations/:election_id",
//   adminAuth,
//   validate(settingsValidator.getLaunchpadValidors),
//   settingsController.getElectionValidations
// );

// router.get(
//   "/ballot/:election_id",
//   adminAuth,
//   validate(settingsValidator.getElectionBallot),
//   settingsController.getElectionBallot
// );

router.get(
  "/election/:election_id",
  adminAuth,
  validate(settingsValidator.getElectionById),
  settingsController.getOneById
);

// router.get(
//   "/election/all/:organization_id",
//   adminAuth,
//   validate(settingsValidator.getAllElection),
//   settingsController.getAllElection
// );

// router.post(
//   "/launch/:election_id",
//   adminAuth,
//   validate(settingsValidator.launchElection),
//   settingsController.launchElection
// );

const launchpadRoute = router;

export default launchpadRoute;