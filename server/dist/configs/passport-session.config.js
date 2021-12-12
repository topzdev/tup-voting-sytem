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
const passport_local_1 = require("passport-local");
const typeorm_1 = require("typeorm");
const password_helper_1 = require("../helpers/password.helper");
const user_entity_1 = require("../modules/user/entity/user.entity");
const verifyPassportAsync = (username, password, done) => {
    if (!username)
        return done(null, false, { message: "Username is required" });
    console.log(username, password);
    (0, typeorm_1.getRepository)(user_entity_1.User)
        .createQueryBuilder("user")
        .addSelect("user.id")
        .addSelect("user.username")
        .addSelect("user.password")
        .where("user.username = :userText", { userText: username })
        .getOne()
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user)
            return done(null, false, { message: "Incorrect username" });
        console.log("Username Passed", user);
        console.log("Checking password", yield (0, password_helper_1.validatePassword)(password, user.password));
        if (!(yield (0, password_helper_1.validatePassword)(password, user.password))) {
            return done(null, false, { message: "Incorrect password" });
        }
        console.log("Password Passed");
        delete user.password;
        return done(null, user, {
            message: "Logged in Succesfully",
        });
    }))
        .catch((error) => {
        console.log("Error", error);
        return done(error);
    });
};
const serializeUserAsync = (user, done) => {
    console.log("SerializedUserr", user);
    done(null, user.id);
};
const deserializeUserAsnyc = (id, done) => {
    console.log("DeserializedUser:", id);
    user_entity_1.User.findOne(id)
        .then((user) => done(null, user))
        .catch((error) => done(error));
};
const passportSessionConfig = (app) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("passport config loaded");
    passport_1.default.use("admin", new passport_local_1.Strategy(verifyPassportAsync));
    passport_1.default.serializeUser(serializeUserAsync);
    passport_1.default.deserializeUser(deserializeUserAsnyc);
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
});
exports.default = passportSessionConfig;
//# sourceMappingURL=passport-session.config.js.map