import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import rolesAllowed from "../../middlewares/roles-allowed.middleware";
import validate from "../../middlewares/validate.middleware";
import voterController from "./voter.controller";
import voterValidator from "./voter.validator";
const router = express.Router();

console.log("module: Voter Module Loaded");

router.get(
  "/election-voters",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  voterController.getElectionVoters
);

router.get(
  "/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  voterController.getOneById
);

router.get(
  "/all/:electionId",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  voterController.getAll
);
router.get(
  "/all-pre-registered/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  voterController.getAllPreRegistered
);

router.get(
  "/voter-id/:voterId",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  voterController.getOneByVoterId
);

router.get(
  "/email/:email",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  voterController.getOneByEmailAddress
);

router.get(
  "/exist/voter-id/:voterId",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  voterController.isExistByVoterId
);

router.get(
  "/exist/email/:email",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  voterController.isExistByEmailAddress
);

router.post(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  validate(voterValidator.create),
  voterController.create
);

router.put(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  validate(voterValidator.update),
  voterController.update
);

router.delete(
  "/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  voterController.remove
);

router.put(
  "/restore/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  voterController.restore
);

router.post(
  "/export-to-csv/:electionId",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  voterController.exportVotersToCSV
);

router.post(
  "/import-by-election",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  voterController.importVotersByElection
);

router.post(
  "/import-by-csv",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  voterController.importVotersByCsv
);

router.post(
  "/disallow",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  voterController.disallowVoters
);

router.post(
  "/allow",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  voterController.allowVoters
);

router.post(
  "/remove",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  voterController.removeVoters
);

router.post(
  "/grant-pre-register",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  voterController.grantPreRegister
);

const voterRoute = router;

export default voterRoute;
