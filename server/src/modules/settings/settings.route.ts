import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import rolesAllowed from "../../middlewares/roles-allowed.middleware";
import validate from "../../middlewares/validate.middleware";
import settingsController from "./settings.controller";
import settingsValidator from "./settings.validator";
const router = express.Router();

console.log("module: Settings Module Loaded");

router.put(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  validate(settingsValidator.update),
  settingsController.update
);

router.put(
  "/archive/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  settingsController.archive
);

router.put(
  "/closeElection/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  settingsController.closeElection
);
const settingsRoute = router;

export default settingsRoute;