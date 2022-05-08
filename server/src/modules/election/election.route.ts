import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import rolesAllowed from "../../middlewares/roles-allowed.middleware";
import validate from "../../middlewares/validate.middleware";
import electionController from "./election.controller";
import electionValidator from "./election.validator";
const router = express.Router();

console.log("module: Election Module Loaded");

router.get("/:id", adminAuth, electionController.getOneById);

router.get(
  "/all/:org_id",
  adminAuth,
  rolesAllowed("SUPER_ADMIN"),
  electionController.getAll
);

router.get(
  "/public/:org_id",
  adminAuth,
  rolesAllowed("SUPER_ADMIN"),
  electionController.getPublic
);

router.get(
  "/final-tally/:election_id",
  // voterAuth,
  // // validate(resultsValidator.getElectionBySlug),
  electionController.getElectionWinners
);

router.get("/slug/:slug", adminAuth, electionController.getOneBySlug);

router.get("/exist/:slug", adminAuth, electionController.isExistBySlug);

router.post(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  validate(electionValidator.create),
  electionController.create
);

router.put(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  validate(electionValidator.update),
  electionController.update
);

router.delete(
  "/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  electionController.remove
);

router.put(
  "/restore/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  electionController.restore
);

router.put(
  "/archive/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  electionController.archive
);

router.put(
  "/unarchive/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  electionController.unarchive
);

const electionRoute = router;

export default electionRoute;
