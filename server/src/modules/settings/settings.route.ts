import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import rolesAllowed from "../../middlewares/roles-allowed.middleware";
import validate from "../../middlewares/validate.middleware";
import settingsController from "./settings.controller";
import settingsValidator from "./settings.validator";
const router = express.Router();

console.log("module: Settings Module Loaded");

router.put(
  "/general/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  validate(settingsValidator.updateGeneral),
  settingsController.updateGeneral
);

router.put(
  "/date/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  validate(settingsValidator.updateDate),
  settingsController.updateDate
);

router.put(
  "/archive/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  settingsController.archive
);

router.put(
  "/unarchive/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  settingsController.unArchive
);

router.put(
  "/closeElection/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  settingsController.closeElection
);

router.put(
  "/isElectionPublic/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  settingsController.electionPublicity
);

router.put(
  "/isElectionTallyPublic/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  settingsController.electionTallyPublicity
);

router.put(
  "/allow-pre-register/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  settingsController.electionAllowPreRegister
);

router.post(
  "/voters-credentials/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  settingsController.sendCredentialsEmail
);

router.post(
  "/election-has-launched/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  settingsController.sendElectionHasLaunched
);

router.post(
  "/election-has-ended/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  settingsController.sendElectionHasEnded
);

const settingsRoute = router;

export default settingsRoute;
