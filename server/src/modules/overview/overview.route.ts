import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import rolesAllowed from "../../middlewares/roles-allowed.middleware";
import validate from "../../middlewares/validate.middleware";
import overviewController from "./overview.controller";
import overviewValidator from "./overview.validator";
const router = express.Router();

console.log("module: overview Module Loaded");

router.get(
  "/detail/:election_id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN", "ELECTION_OFFICER"]),
  validate(overviewValidator.getElectionDetails),
  overviewController.getElectionDetails
);

const overviewRoute = router;

export default overviewRoute;
