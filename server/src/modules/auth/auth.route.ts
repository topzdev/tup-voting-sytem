import express from "express";
import { adminAuth, voterAuth } from "../../middlewares/auth.middleware";
import rolesAllowed from "../../middlewares/roles-allowed.middleware";
import validate from "../../middlewares/validate.middleware";
import authController from "./auth.controller";
import authValidator from "./auth.validator";
const router = express.Router();

console.log("module: Auth Module Loaded");

// Admin authentication
router.post(
  "/admin/login",
  validate(authValidator.adminLogin),
  authController.adminLogin
);

router.post("/admin/logout", adminAuth, authController.adminLogout);

router.get("/admin/me", adminAuth, authController.adminMe);

router.post(
  "/system/login",
  validate(authValidator.systemLogin),
  authController.systemLogin
);

router.get(
  "/admin/protected-route",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  authController.adminProtectedRoute
);

// Voter Authentixation
router.post(
  "/voter/login",
  validate(authValidator.voterLogin),
  authController.voterLogin
);

router.post("/voter/logout", voterAuth, authController.voterLogout);

router.get("/voter/me", voterAuth, authController.voterMe);

const authRoute = router;

export default authRoute;
