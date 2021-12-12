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
const body_parser_1 = __importDefault(require("body-parser"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const file_upload_config_1 = __importDefault(require("./configs/file-upload.config"));
const morgan_config_1 = __importDefault(require("./configs/morgan.config"));
const error_handlers_middleware_1 = __importDefault(require("./middlewares/error-handlers.middleware"));
const routes_1 = __importDefault(require("./routes"));
const port = 5000;
const app = (0, express_1.default)();
const bootsrap = () => __awaiter(void 0, void 0, void 0, function* () {
    // middlewares
    app.use((0, cors_1.default)());
    app.use(body_parser_1.default.urlencoded({ extended: false }));
    app.use(body_parser_1.default.json());
    app.use((0, connect_flash_1.default)());
    (0, file_upload_config_1.default)(app);
    // sessionConfig(app);
    // passportConfig(app);
    (0, morgan_config_1.default)(app);
    app.get("/", (req, res) => {
        res.send("Welcome to TUP VOTING SYSTEM SERVER");
    });
    // routes
    app.use("/api/v1", routes_1.default);
    app.use(error_handlers_middleware_1.default);
    app.listen(port, () => {
        console.log(`TUP Voting System Server was listening at http://localhost:${port}`);
    });
});
exports.default = bootsrap;
//# sourceMappingURL=app.js.map