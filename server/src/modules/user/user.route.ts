import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import rolesAllowed from "../../middlewares/roles-allowed.middleware";
import validate from "../../middlewares/validate.middleware";
import userController from "./user.controller";
import userValidator from "./user.validator";
const router = express.Router();

console.log("module: User Module Loaded");

router.get(
  "/",
  adminAuth,
  rolesAllowed("SUPER_ADMIN"),
  userController.getUsers
);

router.get("/:id", adminAuth, userController.getUserById);

router.post(
  "/",
  // adminAuth,
  // rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  validate(userValidator.create),
  userController.create
);

router.put(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  validate(userValidator.update),
  userController.update
);
router.put(
  "/change-password",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  userController.changePassword
);

router.put(
  "/reset-password/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  userController.resetPassword
);

router.delete(
  "/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  userController.remove
);

router.put(
  "/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  userController.restore
);

const userRoute = router;

export default userRoute;
