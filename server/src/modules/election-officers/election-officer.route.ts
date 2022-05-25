import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import rolesAllowed from "../../middlewares/roles-allowed.middleware";
import validate from "../../middlewares/validate.middleware";
import electionOfficerController from "./election-officer.controller";
import userValidator from "./election-officer.validator";
const router = express.Router();

console.log("module: User Module Loaded");

router.post(
  "/all/",
  adminAuth,
  rolesAllowed(["SUPER_ADMIN", "ADMIN"]),
  electionOfficerController.getOfficers
);

router.post(
  "/one",
  adminAuth,
  rolesAllowed(["SUPER_ADMIN", "ADMIN"]),
  electionOfficerController.getOfficerById
);

router.post(
  "/create",
  adminAuth,
  rolesAllowed(["SUPER_ADMIN", "ADMIN"]),
  validate(userValidator.create),
  electionOfficerController.create
);

router.put(
  "/update",
  adminAuth,
  rolesAllowed(["SUPER_ADMIN", "ADMIN"]),
  validate(userValidator.update),
  electionOfficerController.update
);

const electionOfficerRoute = router;

export default electionOfficerRoute;
