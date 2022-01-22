import express from "express";
import { adminAuth, voterAuth } from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validate.middleware";
import votingController from "./voting.controller";
import votingValidator from "./voting.validator";
const router = express.Router();

console.log("module: Voting Module Loaded");

router.get(
  "/election/slug/:slug",
  // voterAuth,
  validate(votingValidator.getElectionBySlug),
  votingController.getElectionBySlug
);

router.get(
  "/election/id/:election_id",
  // voterAuth,
  validate(votingValidator.getElectionById),
  votingController.getElectionById
);

router.get(
  "/candidate/:candidate_id",
  // voterAuth,
  validate(votingValidator.getCandidateInfo),
  votingController.getCandidateInfo
);

router.get(
  "/ballot/:election_id",
  // voterAuth,
  validate(votingValidator.getElectionBallot),
  votingController.getElectionBallot
);

router.post(
  "/ballot",
  // voterAuth,
  validate(votingValidator.submitBallot),
  votingController.submitBallot
);

const votingRoute = router;

export default votingRoute;
