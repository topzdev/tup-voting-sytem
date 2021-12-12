"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const _1 = __importDefault(require("."));
const fileUploadConfig = (app) => {
    app.use((0, express_fileupload_1.default)(_1.default.fileExpress));
};
exports.default = fileUploadConfig;
//# sourceMappingURL=file-upload.config.js.map