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
const passport_jwt_1 = require("passport-jwt");
const _1 = __importDefault(require("."));
const user_entity_1 = require("../modules/user/entity/user.entity");
const options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: _1.default.jwt.admin.secret,
};
const verifyJWTPassportAsync = (jwt_payload, done) => {
    user_entity_1.User.findOne(jwt_payload.sub.id);
};
const passportJWTConfig = (app) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.use("admin", new passport_jwt_1.Strategy(options, verifyJWTPassportAsync));
    app.use(passport_1.default.initialize());
});
//# sourceMappingURL=passport-jwt.config.js.map