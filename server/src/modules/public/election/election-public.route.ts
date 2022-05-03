import express from "express";
import electionController from "./election-public.controller";
const router = express.Router();

console.log("module: Election Public Module Loaded");

router.get("/election/:slug", electionController.getElectionContent);

const electionPublicRoute = router;

export default electionPublicRoute;
