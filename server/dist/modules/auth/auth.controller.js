"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const http_exception_1 = require("../../helpers/errors/http.exception");
const auth_service_1 = __importDefault(require("./auth.service"));
const adminLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const credentials = req.body;
        res.status(200).json(yield auth_service_1.default.adminLogin(credentials));
    }
    catch (error) {
        next(error);
    }
});
const adminLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: "Logout Successfully" });
    }
    catch (error) {
        next(error);
    }
});
const adminProtectedRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.admin;
        res.status(200).json({ message: `Welcome Admin, ${admin.username}` });
    }
    catch (error) {
        next(error);
    }
});
const adminMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.admin;
        res
            .status(200)
            .json({ message: "Admin Info Succesfully Fetched", user: admin });
    }
    catch (error) {
        next(error);
    }
});
const adminSessignLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("admin", function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new http_exception_1.HttpException("NOT_FOUND", "Invalid username or password"));
        }
        console.log("test", info, req);
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.status(200).json({
                user,
            });
        });
    })(req, res, next);
});
const adminSessionLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.logout();
        res.status(200).json({ message: "Logout Successfully" });
    }
    catch (error) {
        next(error);
    }
});
const authController = {
    adminLogin,
    adminLogout,
    adminProtectedRoute,
    adminMe,
};
exports.default = authController;
//# sourceMappingURL=auth.controller.js.map