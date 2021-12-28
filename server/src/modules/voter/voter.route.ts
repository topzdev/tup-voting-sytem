import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import rolesAllowed from "../../middlewares/roles-allowed.middleware";
import validate from "../../middlewares/validate.middleware";
import voterController from "./voter.controller";
import voterValidator from "./voter.validator";
const router = express.Router();

console.log("module: Voter Module Loaded");

router.get("/", adminAuth, rolesAllowed("SUPER_ADMIN"), voterController.getAll);

router.get("/:id", adminAuth, voterController.getOneById);

router.get("/slug/:slug", adminAuth, voterController.getOneBySlug);

router.get("/exist/:slug", adminAuth, voterController.isExistBySlug);

router.post(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  validate(voterValidator.create),
  voterController.create
);

router.put(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  validate(voterValidator.update),
  voterController.update
);

router.delete(
  "/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  voterController.remove
);

router.put(
  "/restore/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  voterController.restore
);

router.put(
  "/archive/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  voterController.archive
);

router.put(
  "/unarchive/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  voterController.unarchive
);

const voterRoute = router;

export default voterRoute;
