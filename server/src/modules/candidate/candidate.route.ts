import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import rolesAllowed from "../../middlewares/roles-allowed.middleware";
import sanitize from "../../middlewares/sanitize.middleware";
import validate from "../../middlewares/validate.middleware";
import candidateController from "./candidate.controller";
import candidateSanitizer from "./candidate.sanitizer";
import candidateValidator from "./candidate.validator";
const router = express.Router();

console.log("module: Candidates Module Loaded");

router.get(
  "/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  candidateController.getOneById
);

router.get(
  "/all/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  candidateController.getAll
);

router.post(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  validate(candidateValidator.create),
  sanitize(candidateSanitizer.create),
  candidateController.create
);

router.put(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  validate(candidateValidator.update),
  sanitize(candidateSanitizer.update),
  candidateController.update
);

router.delete(
  "/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  candidateController.remove
);

router.put(
  "/restore/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  candidateController.restore
);

router.put(
  "/archive/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  candidateController.archive
);

router.put(
  "/unarchive/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  candidateController.unarchive
);

router.post(
  "/import/csv",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  candidateController.importFromCSV
);

router.post(
  "/position-avail",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  candidateController.checkPositionAvailability
);

const candidateRoute = router;

export default candidateRoute;
