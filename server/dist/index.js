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
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const app_1 = __importDefault(require("./app"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const configs_1 = __importDefault(require("./configs"));
cloudinary_1.default.v2.config(configs_1.default.cloudinary);
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, typeorm_1.createConnection)()
        .then((connect) => {
        console.log("Database Host:", configs_1.default.database.host);
        console.log("Connection Name:", connect.name);
        console.log("Database Created Successfully");
    })
        .catch((err) => {
        console.log(err);
    });
    yield (0, app_1.default)();
});
main();
//# sourceMappingURL=index.js.map