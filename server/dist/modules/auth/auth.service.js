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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/entity/user.entity");
const password_helper_1 = require("../../helpers/password.helper");
const http_exception_1 = require("../../helpers/errors/http.exception");
const jwt_helper_1 = require("../../helpers/jwt.helper");
const adminLogin = (_credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, typeorm_1.getRepository)(user_entity_1.User)
        .createQueryBuilder("user")
        .select([
        "user.id",
        "user.firstname",
        "user.lastname",
        "user.password",
        "user.username",
        "user.role",
    ])
        .where("user.username = :userText", { userText: _credentials.username })
        .getOne();
    if (!user)
        return new http_exception_1.HttpException("BAD_REQUEST", "Incorrect username");
    if (!(yield (0, password_helper_1.validatePassword)(_credentials.password, user.password))) {
        return new http_exception_1.HttpException("BAD_REQUEST", "Incorrect password");
    }
    delete user.password;
    const { token, expiresIn } = (0, jwt_helper_1.signJwtAdminPayload)(user);
    return {
        token,
        user,
        expiresIn,
    };
});
const authServices = {
    adminLogin,
};
exports.default = authServices;
//# sourceMappingURL=auth.service.js.map