import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import rolesAllowed from "../../middlewares/roles-allowed.middleware";
import validate from "../../middlewares/validate.middleware";
import userController from "./user.controller";
import userValidator from "./user.validator";
const router = express.Router();

console.log("module: User Module Loaded");

router.get(
  "/all/",
  adminAuth,
  rolesAllowed("SUPER_ADMIN"),
  userController.getUsers
);

router.get(
  "/one/:id",
  adminAuth,
  rolesAllowed(["SUPER_ADMIN"]),
  userController.getUserById
);

router.put(
  "/disable-user",
  adminAuth,
  rolesAllowed("SUPER_ADMIN"),
  userController.disableUser
);

router.put(
  "/change-role",
  adminAuth,
  rolesAllowed("SUPER_ADMIN"),
  validate(userValidator.changeRole),
  userController.changeRole
);

router.post(
  "/",
  adminAuth,
  rolesAllowed(["SUPER_ADMIN"]),
  validate(userValidator.create),
  userController.create
);

router.put(
  "/",
  adminAuth,
  rolesAllowed(["SUPER_ADMIN"]),
  validate(userValidator.update),
  userController.update
);

router.put(
  "/reset-password/:id",
  adminAuth,
  rolesAllowed(["SUPER_ADMIN"]),
  userController.resetPassword
);

router.delete(
  "/:id",
  adminAuth,
  rolesAllowed(["SUPER_ADMIN"]),
  userController.remove
);

router.put(
  "/:id",
  adminAuth,
  rolesAllowed(["SUPER_ADMIN"]),
  userController.restore
);

router.put(
  "/change-password",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  validate(userValidator.changePassword),
  userController.changePassword
);

router.get(
  "/my-account",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  userController.myAccount
);

const userRoute = router;

export default userRoute;
