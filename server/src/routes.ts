import express from "express";
import photoRoute from "./modules/photo/photo.route";
import userRoute from "./modules/user/user.route";

const router = express.Router();

router.use("/user", userRoute);
router.use("/photo", photoRoute);

export default router;
