"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const morganConfig = (app) => {
    morgan_1.default.token("body", (req) => req.body);
    morgan_1.default.token("params", (req) => {
        let paramStrings = "";
        Object.entries(req.params).forEach(([key, value]) => {
            paramStrings += `${key}: ${value}`;
        });
        return paramStrings;
    });
    app.use((0, morgan_1.default)("dev"));
};
exports.default = morganConfig;
//# sourceMappingURL=morgan.config.js.map