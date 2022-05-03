import express from "express";
import { adminAuth } from "../../../middlewares/auth.middleware";
import rolesAllowed from "../../../middlewares/roles-allowed.middleware";
import candidateController from "./candidate-public.controller";

const router = express.Router();

console.log("module: Candidates Public Module Loaded");

router.get("/candidate/:candidate_id", candidateController.getCandidate);

const candidatePublicRoute = router;

export default candidatePublicRoute;
