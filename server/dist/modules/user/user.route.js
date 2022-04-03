"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const roles_allowed_middleware_1 = __importDefault(require("../../middlewares/roles-allowed.middleware"));
const validate_middleware_1 = __importDefault(require("../../middlewares/validate.middleware"));
const user_controller_1 = __importDefault(require("./user.controller"));
const user_validator_1 = __importDefault(require("./user.validator"));
const router = express_1.default.Router();
console.log("module: User Module Loaded");
router.get("/", auth_middleware_1.adminAuth, (0, roles_allowed_middleware_1.default)("SUPER_ADMIN"), user_controller_1.default.getUsers);
router.get("/:id", auth_middleware_1.adminAuth, user_controller_1.default.getUserById);
router.post("/", 
// adminAuth,
// rolesAllowed(["ADMIN", "SUPER_ADMIN"]),
(0, validate_middleware_1.default)(user_validator_1.default.create), user_controller_1.default.create);
router.put("/", auth_middleware_1.adminAuth, (0, roles_allowed_middleware_1.default)(["ADMIN", "SUPER_ADMIN"]), (0, validate_middleware_1.default)(user_validator_1.default.update), user_controller_1.default.update);
router.put("/change-password", auth_middleware_1.adminAuth, (0, roles_allowed_middleware_1.default)(["ADMIN", "SUPER_ADMIN"]), user_controller_1.default.changePassword);
router.put("/reset-password/:id", auth_middleware_1.adminAuth, (0, roles_allowed_middleware_1.default)(["ADMIN", "SUPER_ADMIN"]), user_controller_1.default.resetPassword);
router.delete("/:id", auth_middleware_1.adminAuth, (0, roles_allowed_middleware_1.default)(["ADMIN", "SUPER_ADMIN"]), user_controller_1.default.remove);
router.put("/:id", auth_middleware_1.adminAuth, (0, roles_allowed_middleware_1.default)(["ADMIN", "SUPER_ADMIN"]), user_controller_1.default.restore);
const userRoute = router;
exports.default = userRoute;
//# sourceMappingURL=user.route.js.map