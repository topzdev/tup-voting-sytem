"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const http_exception_1 = require("../helpers/errors/http.exception");
const adminAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        next(new http_exception_1.HttpException("UNAUTHORIZED", "You dont have admin privilege, Please contact administrator"));
    }
};
exports.adminAuth = adminAuth;
//# sourceMappingURL=auth-session.middleware.legacy.js.map