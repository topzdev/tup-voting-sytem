"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_exception_1 = require("../helpers/errors/http.exception");
const user_inteface_1 = require("../modules/user/user.inteface");
const rolesAllowed = (roles) => {
    return (req, res, next) => {
        console.log("Roles Middleware");
        if (!roles || !roles.length)
            next(new http_exception_1.HttpException("BAD_REQUEST", "Roles not provided"));
        if (!req.admin)
            next(new http_exception_1.HttpException("NOT_FOUND", "User info is not provided"));
        const user = req.admin;
        const printOut = () => {
            return `AdminUser: ${user.username} - ${user.role} is allowed to used ${req.originalUrl}`;
        };
        if (Array.isArray(roles)) {
            if (roles.findIndex((item) => {
                return user_inteface_1.UserRole[item] === user.role;
            }) !== -1) {
                console.log(printOut());
                next();
            }
            else {
                next(new http_exception_1.HttpException("UNAUTHORIZED", "You dont have any privileges to used this route"));
            }
        }
        if (typeof roles === "string") {
            console.log("String test");
            if (user_inteface_1.UserRole[roles] === user.role) {
                console.log(printOut());
                next();
            }
            else {
                next(new http_exception_1.HttpException("UNAUTHORIZED", "You dont have any privileges to used this route"));
            }
        }
    };
};
exports.default = rolesAllowed;
//# sourceMappingURL=roles-allowed.middleware.js.map