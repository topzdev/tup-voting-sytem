"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const roles_allowed_middleware_1 = __importDefault(require("../../middlewares/roles-allowed.middleware"));
const validate_middleware_1 = __importDefault(require("../../middlewares/validate.middleware"));
const organization_controller_1 = __importDefault(require("./organization.controller"));
const organization_validator_1 = __importDefault(require("./organization.validator"));
const router = express_1.default.Router();
console.log("module: Organization Module Loaded");
router.get("/", auth_middleware_1.adminAuth, (0, roles_allowed_middleware_1.default)("SUPER_ADMIN"), organization_controller_1.default.getAll);
router.get("/:id", auth_middleware_1.adminAuth, organization_controller_1.default.getOneById);
router.get("/slug/:slug", auth_middleware_1.adminAuth, organization_controller_1.default.getOneBySlug);
router.get("/exist/:slug", auth_middleware_1.adminAuth, organization_controller_1.default.isExistBySlug);
router.post("/", auth_middleware_1.adminAuth, (0, roles_allowed_middleware_1.default)(["ADMIN", "SUPER_ADMIN"]), (0, validate_middleware_1.default)(organization_validator_1.default.create), organization_controller_1.default.create);
router.put("/", auth_middleware_1.adminAuth, (0, roles_allowed_middleware_1.default)(["ADMIN", "SUPER_ADMIN"]), (0, validate_middleware_1.default)(organization_validator_1.default.update), organization_controller_1.default.update);
router.delete("/:id", auth_middleware_1.adminAuth, (0, roles_allowed_middleware_1.default)(["ADMIN", "SUPER_ADMIN"]), organization_controller_1.default.remove);
router.put("/restore/:id", auth_middleware_1.adminAuth, (0, roles_allowed_middleware_1.default)(["ADMIN", "SUPER_ADMIN"]), organization_controller_1.default.restore);
router.put("/archive/:id", auth_middleware_1.adminAuth, (0, roles_allowed_middleware_1.default)(["ADMIN", "SUPER_ADMIN"]), organization_controller_1.default.archive);
router.put("/unarchive/:id", auth_middleware_1.adminAuth, (0, roles_allowed_middleware_1.default)(["ADMIN", "SUPER_ADMIN"]), organization_controller_1.default.unarchive);
const organizationRoute = router;
exports.default = organizationRoute;
//# sourceMappingURL=organization.route.js.map