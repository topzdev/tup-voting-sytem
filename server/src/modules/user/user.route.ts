import express from "express";
import { adminAuth } from "../../middlewares/auth-session.middleware.legacy";
import rolesAllowed from "../../middlewares/roles-allowed.middleware";
import userController from "./user.controller";
const router = express.Router();

console.log("module: User Module Loaded");

router.get("/", adminAuth, userController.getUsers);

router.get("/:id", adminAuth, userController.getUserById);

router.post(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  userController.create
);

router.put(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  userController.update
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
