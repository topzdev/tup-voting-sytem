import express from "express";
import authRoute from "./modules/auth/auth.route";
import photoRoute from "./modules/photo/photo.route";
import userRoute from "./modules/user/user.route";
import organizationRoute from "./modules/organization/organization.route";
import electionRoute from "./modules/election/election.route";
import candidateRoute from "./modules/candidate/candidate.route";
import positionRoute from "./modules/position/position.route";
import voterRoute from "./modules/voter/voter.route";
import partyRoute from "./modules/party/party.route";
import launchpadRoute from "./modules/launchpad/launchpad.route";

const router = express.Router();

router.use("/user", userRoute);
router.use("/photo", photoRoute);
router.use("/auth", authRoute);
router.use("/org", organizationRoute);
router.use("/election", electionRoute);
router.use("/candidate", candidateRoute);
router.use("/position", positionRoute);
router.use("/voter", voterRoute);
router.use("/party", partyRoute);
router.use("/launchpad", launchpadRoute);

export default router;
