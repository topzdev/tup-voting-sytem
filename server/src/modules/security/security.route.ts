import express from "express";
import { voterAuth } from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validate.middleware";
import securityController from "./security.controller";
import securityValidator from "./security.validator";
const router = express.Router();

console.log("module: Security Module Loaded");

router.get("/test-encrypt/", securityController.TEST_pin_encrypt);

router.get("/test-decrypt/", securityController.TEST_pin_decrypt);

const securityRoute = router;

export default securityRoute;
