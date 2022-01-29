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
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  validate(settingsValidator.updateGeneral),
  settingsController.updateGeneral
);

router.put(
  "/date/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  validate(settingsValidator.updateDate),
  settingsController.updateDate
);

router.put(
  "/archive/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  settingsController.archive
);

router.put(
  "/unarchive/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  settingsController.unArchive
);

router.put(
  "/closeElection/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  settingsController.closeElection
);
const settingsRoute = router;

export default settingsRoute;