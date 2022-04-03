"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voterAuth = exports.adminAuth = void 0;
const http_exception_1 = require("../helpers/errors/http.exception");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = __importDefault(require("../configs"));
const adminAuth = (req, res, next) => {
    try {
        const tokenParts = req.headers.authorization.split(" ");
        console.log("Admin Authorization", req.headers.authorization);
        if (tokenParts[0] !== "Bearer" &&
            tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
            throw Error();
        }
        console.log(configs_1.default.jwt.admin);
        console.log("Token Parts", tokenParts[1]);
        const decoded = jsonwebtoken_1.default.verify(tokenParts[1], configs_1.default.jwt.admin.secret);
        req.admin_jwt = decoded;
        if (typeof decoded !== "string")
            req.admin = decoded.admin;
        next();
    }
    catch (error) {
        console.log("Auth Admin Error: ", error);
        next(new http_exception_1.HttpException("UNAUTHORIZED", "You dont have admin privilege, Please contact administrator"));
    }
};
exports.adminAuth = adminAuth;
const voterAuth = (req, res, next) => {
    try {
        const tokenParts = req.headers.authorization.split(" ");
        console.log("Voter Authorization", req.headers.authorization);
        if (tokenParts[0] !== "Bearer" &&
            tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
            throw Error();
        }
        console.log("Token Parts", tokenParts[1], "Configs", configs_1.default.jwt.voter.secret);
        const decoded = jsonwebtoken_1.default.verify(tokenParts[1], configs_1.default.jwt.voter.secret);
        console.log("Decoded", decoded);
        req.voter_jwt = decoded;
        if (typeof decoded !== "string")
            req.voter = decoded.voter;
        next();
    }
    catch (error) {
        console.error("Catch Error: ", error);
        next(new http_exception_1.HttpException("UNAUTHORIZED", "Something went wrong"));
    }
};
exports.voterAuth = voterAuth;
exports.default = {
    adminAuth: exports.adminAuth,
    voterAuth: exports.voterAuth,
};
//# sourceMappingURL=auth.middleware.js.map