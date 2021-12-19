import express from "express";
import authRoute from "./modules/auth/auth.route";
import photoRoute from "./modules/photo/photo.route";
import userRoute from "./modules/user/user.route";
import organizationRoute from "./modules/organization/organization.route";
import electionRoute from "./modules/election/election.route";

const router = express.Router();

router.use("/user", userRoute);
router.use("/photo", photoRoute);
router.use("/auth", authRoute);
router.use("/org", organizationRoute);
router.use("/election", electionRoute);

export default router;
