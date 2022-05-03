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

router.get(
  "/my-account",
  adminAuth,
  rolesAllowed(["SUPER_ADMIN", "ADMIN"]),
  userController.myAccount
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
  "/create",
  adminAuth,
  rolesAllowed(["SUPER_ADMIN"]),
  validate(userValidator.create),
  userController.create
);

router.put(
  "/update",
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

router.put(
  "/change-password",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  validate(userValidator.changePassword),
  userController.changePassword
);

router.delete(
  "/remove/:id",
  adminAuth,
  rolesAllowed(["SUPER_ADMIN"]),
  userController.remove
);

router.put(
  "/restore/:id",
  adminAuth,
  rolesAllowed(["SUPER_ADMIN"]),
  userController.restore
);

router.post(
  "/reactivate",
  adminAuth,
  rolesAllowed(["SUPER_ADMIN"]),
  userController.reactivateAccount
);

const userRoute = router;

export default userRoute;
