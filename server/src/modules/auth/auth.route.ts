import express from "express";
import passport from "passport";
import authController from "./auth.controller";
const router = express.Router();

console.log("module: Auth Module Loaded");

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);
router.post("/logout", authController.logout);

const authRoute = router;

export default authRoute;
