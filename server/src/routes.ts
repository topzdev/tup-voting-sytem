import express from "express";
import userRoute from "./modules/user/user.route";

const router = express.Router();

router.use("/user", userRoute);

module.exports = router;
