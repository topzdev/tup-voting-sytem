import express from "express";
import photoController from "./photo.controller";
const router = express.Router();

console.log("module: Photo Module Loaded");

router.post("/test", photoController.uploadTester);

const photoRoute = router;

export default photoRoute;
