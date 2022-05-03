import express from "express";
import { adminAuth } from "../../../middlewares/auth.middleware";
import rolesAllowed from "../../../middlewares/roles-allowed.middleware";
import candidateController from "./candidate.controller";

const router = express.Router();

console.log("module: Candidates Public Module Loaded");

router.get(
  "/all/:election_id",
  adminAuth,
  rolesAllowed("SUPER_ADMIN"),
  candidateController.getAll
);


const candidatePublicRoute = router;

export default candidatePublicRoute;
