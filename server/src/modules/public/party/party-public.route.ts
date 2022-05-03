import express from "express";
import { adminAuth } from "../../../middlewares/auth.middleware";
import rolesAllowed from "../../../middlewares/roles-allowed.middleware";
import validate from "../../../middlewares/validate.middleware";
import partyController from "./party-public.controller";
import partyValidator from "../../party/party.validator";
const router = express.Router();

console.log("module: Party Public Module Loaded");

router.get("/party/:party_id", partyController.getPartyContent);

const partyPublicRoute = router;

export default partyPublicRoute;
