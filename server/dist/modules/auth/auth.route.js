"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const roles_allowed_middleware_1 = __importDefault(require("../../middlewares/roles-allowed.middleware"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const router = express_1.default.Router();
console.log("module: Auth Module Loaded");
router.post("/admin/login", auth_controller_1.default.adminLogin);
router.post("/admin/logout", auth_middleware_1.adminAuth, auth_controller_1.default.adminLogout);
router.get("/admin/me", auth_middleware_1.adminAuth, auth_controller_1.default.adminMe);
router.get("/admin/protected-route", auth_middleware_1.adminAuth, (0, roles_allowed_middleware_1.default)(["DEV", "SUPER_ADMIN"]), auth_controller_1.default.adminProtectedRoute);
const authRoute = router;
exports.default = authRoute;
//# sourceMappingURL=auth.route.js.map