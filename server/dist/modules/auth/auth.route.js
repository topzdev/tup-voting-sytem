"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const roles_allowed_middleware_1 = __importDefault(require("../../middlewares/roles-allowed.middleware"));
const validate_middleware_1 = __importDefault(require("../../middlewares/validate.middleware"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const auth_validator_1 = __importDefault(require("./auth.validator"));
const router = express_1.default.Router();
console.log("module: Auth Module Loaded");
// Admin authentication
router.post("/admin/login", (0, validate_middleware_1.default)(auth_validator_1.default.adminLogin), auth_controller_1.default.adminLogin);
router.post("/admin/logout", auth_middleware_1.adminAuth, auth_controller_1.default.adminLogout);
router.get("/admin/me", auth_middleware_1.adminAuth, auth_controller_1.default.adminMe);
router.get("/admin/protected-route", auth_middleware_1.adminAuth, (0, roles_allowed_middleware_1.default)(["DEV", "SUPER_ADMIN"]), auth_controller_1.default.adminProtectedRoute);
// Voter Authentixation
router.post("/voter/login", (0, validate_middleware_1.default)(auth_validator_1.default.voterLogin), auth_controller_1.default.voterLogin);
router.post("/voter/logout", auth_middleware_1.voterAuth, auth_controller_1.default.voterLogout);
router.get("/voter/me", auth_middleware_1.voterAuth, auth_controller_1.default.voterMe);
const authRoute = router;
exports.default = authRoute;
//# sourceMappingURL=auth.route.js.map