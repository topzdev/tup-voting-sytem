import express from "express";
import { adminAuth } from "../../../middlewares/auth.middleware";
import rolesAllowed from "../../../middlewares/roles-allowed.middleware";
import validate from "../../../middlewares/validate.middleware";
import electionController from "./election.controller";
import electionValidator from "../../election/election.validator";
const router = express.Router();

console.log("module: Homepage Module Loaded");

router.get(
  "/all/:org_id",
  adminAuth,
  rolesAllowed("SUPER_ADMIN"),
  electionController.getAll
);

const homepageRoute = router;

export default homepageRoute;