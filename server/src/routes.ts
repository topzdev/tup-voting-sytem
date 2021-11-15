import express from "express";
import authRoute from "./modules/auth/auth.route";
import photoRoute from "./modules/photo/photo.route";
import userRoute from "./modules/user/user.route";

const router = express.Router();

router.use("/user", userRoute);
router.use("/photo", photoRoute);
router.use("/auth", authRoute);

export default router;
