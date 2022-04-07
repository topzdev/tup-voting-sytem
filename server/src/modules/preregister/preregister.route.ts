import express from "express";
import validate from "../../middlewares/validate.middleware";
import preregisterController from "./preregister.controller";
import preregisterValidator from "./preregister.validator";
const router = express.Router();

console.log("module: PreRegister Module Loaded");

router.get(
  "/election/:slug",
  validate(preregisterValidator.getElection),
  preregisterController.getElection
);

router.post(
  "/voter-info/",
  validate(preregisterValidator.getVoterInfo),
  preregisterController.getVoterInfo
);

router.post(
  "/is-registered",
  validate(preregisterValidator.isRegistered),
  preregisterController.isRegistered
);

router.post(
  "/pre-register",
  validate(preregisterValidator.preRegisterVoter),
  preregisterController.preRegisterVoter
);

const preregisterRoute = router;

export default preregisterRoute;
