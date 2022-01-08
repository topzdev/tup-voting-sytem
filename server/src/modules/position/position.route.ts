import express from "express";
import { adminAuth } from "../../middlewares/auth.middleware";
import rolesAllowed from "../../middlewares/roles-allowed.middleware";
import validate from "../../middlewares/validate.middleware";
import positionController from "./position.controller";
import positionValidator from "./position.validator";
const router = express.Router();

console.log("module: Position Module Loaded");

router.get("/:id", adminAuth, positionController.getOneById);

router.get(
  "/all/:electionId",
  adminAuth,
  rolesAllowed("SUPER_ADMIN"),
  positionController.getAll
);

router.post(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  validate(positionValidator.create),
  positionController.create
);

router.put(
  "/",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  validate(positionValidator.update),
  positionController.update
);

router.put(
  "/display-order",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  positionController.updateDisplayOrder
);

router.delete(
  "/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  positionController.remove
);

router.put(
  "/restore/:id",
  adminAuth,
  rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
  positionController.restore
);

const positionRoute = router;

export default positionRoute;
