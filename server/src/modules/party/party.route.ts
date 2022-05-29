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
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  partyController.getAll
);

router.get(
  "/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  partyController.getOneById
);

router.get(
  "/all/:electionId",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  partyController.getAll
);

router.post(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  validate(partyValidator.create),
  partyController.create
);

router.put(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  validate(partyValidator.update),
  partyController.update
);

router.delete(
  "/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  partyController.remove
);

router.put(
  "/restore/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  partyController.restore
);

router.put(
  "/archive/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  partyController.archive
);

router.put(
  "/unarchive/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  partyController.unarchive
);

const partyRoute = router;

export default partyRoute;
