import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validate.middleware";
import overviewController from "./overview.controller";
import overviewValidator from "./overview.validator";
const router = express.Router();

console.log("module: overview Module Loaded");

router.get(
    "/detail/:election_id",
    adminAuth,
    validate(overviewValidator.getElectionDetails),
    overviewController.getElectionDetails
  );