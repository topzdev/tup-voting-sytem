import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import rolesAllowed from "../../middlewares/roles-allowed.middleware";
import validate from "../../middlewares/validate.middleware";
import partyController from "./party.controller";
import partyValidator from "./party.validator";
const router = express.Router();

console.log("module: Party Module Loaded");

router.get(
  "/",
  adminAuth,
  rolesAllowed("SUPER_ADMIN"),
  partyController.getAll
);

router.get("/:id", adminAuth, partyController.getOneById);

router.post(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  validate(partyValidator.create),
  partyController.create
);

router.put(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  validate(partyValidator.update),
  partyController.update
);

router.delete(
  "/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  partyController.remove
);

router.put(
  "/restore/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  partyController.restore
);

router.put(
  "/archive/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  partyController.archive
);

router.put(
  "/unarchive/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  partyController.unarchive
);

const partyRoute = router;

export default partyRoute;