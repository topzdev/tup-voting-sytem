"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const photo_route_1 = __importDefault(require("./modules/photo/photo.route"));
const user_route_1 = __importDefault(require("./modules/user/user.route"));
const organization_route_1 = __importDefault(require("./modules/organization/organization.route"));
const router = express_1.default.Router();
router.use("/user", user_route_1.default);
router.use("/photo", photo_route_1.default);
router.use("/auth", auth_route_1.default);
router.use("/org", organization_route_1.default);
exports.default = router;
//# sourceMappingURL=routes.js.map