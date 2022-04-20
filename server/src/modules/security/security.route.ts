import express from "express";
import { voterAuth } from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validate.middleware";
import securityController from "./security.controller";
import securityValidator from "./security.validator";
const router = express.Router();

console.log("module: Security Module Loaded");

router.get(
  "/final-security/:election_id",
  // voterAuth,
  // // validate(securityValidator.getElectionBySlug),
  securityController.getElectionSecurity
);

const securityRoute = router;

export default securityRoute;
