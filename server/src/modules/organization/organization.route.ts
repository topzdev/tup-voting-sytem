import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import rolesAllowed from "../../middlewares/roles-allowed.middleware";
import organizationController from "./organization.controller";
const router = express.Router();

console.log("module: Organization Module Loaded");

router.get(
  "/",
  adminAuth,
  rolesAllowed("SUPER_ADMIN"),
  organizationController.getAll
);

router.get("/:id", adminAuth, organizationController.getOneById);

router.get("/slug/:slug", adminAuth, organizationController.getOneBySlug);

router.get("/exist/:slug", adminAuth, organizationController.isExistBySlug);

router.post(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  organizationController.create
);

router.put(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  organizationController.update
);

router.delete(
  "/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  organizationController.remove
);

router.put(
  "/restore/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  organizationController.restore
);

router.put(
  "/archive/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  organizationController.archive
);

const userRoute = router;

export default userRoute;
