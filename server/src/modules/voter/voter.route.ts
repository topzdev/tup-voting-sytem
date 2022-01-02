import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import rolesAllowed from "../../middlewares/roles-allowed.middleware";
import validate from "../../middlewares/validate.middleware";
import voterController from "./voter.controller";
import voterValidator from "./voter.validator";
const router = express.Router();

console.log("module: Voter Module Loaded");

router.get("/", adminAuth, rolesAllowed("SUPER_ADMIN"), voterController.getAll);

router.get("/election-voters", adminAuth, voterController.getElectionVoters);

router.get("/:id", adminAuth, voterController.getOneById);

router.get("/voter-id/:voterId", adminAuth, voterController.getOneByVoterId);

router.get("/email/:email", adminAuth, voterController.getOneByEmailAddress);

router.get(
  "/exist/voter-id/:voterId",
  adminAuth,
  voterController.isExistByVoterId
);

router.get(
  "/exist/email/:email",
  adminAuth,
  voterController.isExistByEmailAddress
);

router.post(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  validate(voterValidator.create),
  voterController.create
);

router.put(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  validate(voterValidator.update),
  voterController.update
);

router.delete(
  "/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  voterController.remove
);

router.put(
  "/restore/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  voterController.restore
);

router.post(
  "/export-to-csv/:electionId",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  voterController.exportVotersToCSV
);

router.post(
  "/import-by-election",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  voterController.importVotersByElection
);

router.post(
  "/import-by-csv",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  voterController.importVotersByCsv
);

router.post(
  "/disallow",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  voterController.disallowVoters
);

router.post(
  "/allow",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  voterController.allowVoters
);

router.post(
  "/remove",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  voterController.removeVoters
);

const voterRoute = router;

export default voterRoute;
