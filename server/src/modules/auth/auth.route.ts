import express from "express";
import passport from "passport";
import { adminAuth } from "../../middlewares/auth.middleware";
import authController from "./auth.controller";
const router = express.Router();

console.log("module: Auth Module Loaded");

router.post("/admin/login", authController.adminLogin);
router.post("/admin/logout", adminAuth, authController.adminLogout);
router.get(
  "/admin/protected-route",
  adminAuth,
  authController.adminProtectedRoute
);

const authRoute = router;

export default authRoute;
