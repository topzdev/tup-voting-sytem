"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwtVoterPayload = exports.signJwtAdminPayload = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = __importDefault(require("../configs"));
const signJwtAdminPayload = (_user) => {
    const expiresIn = configs_1.default.jwt.admin.expiresIn;
    const secret = configs_1.default.jwt.admin.secret;
    console.log("Payload user: ", _user);
    const payload = {
        admin: _user,
        iat: Date.now(),
    };
    console.log(configs_1.default.jwt.admin);
    const signedToken = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn,
        // algorithm: configs.jwt.admin.algo as any,
    });
    return {
        token: `Bearer ${signedToken}`,
        expiresIn,
    };
};
exports.signJwtAdminPayload = signJwtAdminPayload;
const signJwtVoterPayload = (_voter) => {
    const expiresIn = configs_1.default.jwt.voter.expiresIn;
    const secret = configs_1.default.jwt.voter.secret;
    console.log("Payload voter: ", _voter);
    const payload = {
        voter: _voter,
        iat: Date.now(),
    };
    console.log(configs_1.default.jwt.voter);
    const signedToken = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn,
        // algorithm: configs.jwt.admin.algo as any,
    });
    return {
        token: `Bearer ${signedToken}`,
        expiresIn,
    };
};
exports.signJwtVoterPayload = signJwtVoterPayload;
//# sourceMappingURL=jwt.helper.js.map