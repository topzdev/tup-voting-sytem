import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validate.middleware";
import mailerController from "./mailer.controller";
import mailerValidator from "./mailer.validator";
const router = express.Router();

console.log("module: Mailer Module Loaded");

router.post(
  "/voters-credentials",
  adminAuth,
  validate(mailerValidator.sendVotersCredentialsEmail),
  mailerController.sendVotersCredentialsEmail
);

router.post(
  "/thank-you-for-voting",
  adminAuth,
  validate(mailerValidator.sendThankYouForVotingEmail),
  mailerController.sendThankYouForVotingEmail
);

router.post(
  "/election-has-launched",
  adminAuth,
  validate(mailerValidator.sendElectionHasLaunched),
  mailerController.sendElectionHasLaunched
);

router.post(
  "/election-has-ended",
  adminAuth,
  validate(mailerValidator.sendElectionHasEnded),
  mailerController.sendElectionHasEnded
);

const mailerRoute = router;

export default mailerRoute;
