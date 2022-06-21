import express from "express";
import electionController from "./election-public.controller";
const router = express.Router();

console.log("module: Election Public Module Loaded");

router.get("/content/:slug", electionController.getElectionContent);
router.get(
  "/terms-and-condition/:slug",
  electionController.getElectionTermsAndCondition
);
router.post("/long-url/", electionController.getElectionLongUrl);

const electionPublicRoute = router;

export default electionPublicRoute;
