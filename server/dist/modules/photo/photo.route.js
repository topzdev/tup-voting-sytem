"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const photo_controller_1 = __importDefault(require("./photo.controller"));
const router = express_1.default.Router();
console.log("module: Photo Module Loaded");
router.post("/test", photo_controller_1.default.uploadTester);
const photoRoute = router;
exports.default = photoRoute;
//# sourceMappingURL=photo.route.js.map