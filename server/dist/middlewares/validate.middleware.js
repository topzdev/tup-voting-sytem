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
const express_validator_1 = require("express-validator");
const http_exception_1 = require("../helpers/errors/http.exception");
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return msg;
};
const validate = (validations) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(validations.map((validation) => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req).formatWith(errorFormatter);
        if (!errors.isEmpty()) {
            next(new http_exception_1.HttpException("BAD_REQUEST", errors.array({ onlyFirstError: true })[0]));
        }
        return next();
    });
};
exports.default = validate;
//# sourceMappingURL=validate.middleware.js.map