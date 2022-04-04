"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importStar(require("path"));
const constant_1 = require("../constant");
require("dotenv").config(!constant_1.__prod__
    ? { path: path_1.default.resolve(process.cwd(), "development.env") }
    : undefined);
console.log("config loaded at: ", path_1.default.resolve(path_1.default.resolve(process.cwd(), process.env.NODE_ENV + ".env")));
console.log("------------");
console.log("is development? ", !constant_1.__prod__);
const configs = {
    port: process.env.PORT,
    auth: {
        saltRounds: parseInt(process.env.SALT_ROUNDS),
    },
    database: {
        type: process.env.DATABASE_TYPE,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        synchronize: !constant_1.__prod__,
        logging: !constant_1.__prod__,
        entities: [
            (0, path_1.join)(__dirname, "modules", "**", "entity", "*.{js,ts}"),
            (0, path_1.join)(__dirname, "entity", "*.entity.{js,ts}"),
        ],
        migrations: [(0, path_1.join)(__dirname, "migration", "**", "*.{js,ts}")],
        subscribers: [(0, path_1.join)(__dirname, "subscriber", "**", "*.{js,ts}")],
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
        cli: {
            entitiesDir: (0, path_1.join)(__dirname, "entity"),
            migrationsDir: (0, path_1.join)(__dirname, "migration"),
            subscribersDir: (0, path_1.join)(__dirname, "subscriber"),
        },
        extra: {
            ssl: true,
        },
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_API_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        folder: process.env.CLOUDINARY_API_FOLDER,
        secure: true,
    },
    fileExpress: {
        useTempFiles: true,
        tempFileDir: "/tmp/",
        debug: !constant_1.__prod__,
    },
    session: {
        secret: process.env.SESSION_SECRET,
    },
    jwt: {
        admin: {
            secret: process.env.JWT_ADMIN_SECRET,
            algo: process.env.JWT_ADMIN_ALGO,
            expiresIn: !constant_1.__prod__ ? "30d" : "1d",
        },
        voter: {
            secret: process.env.JWT_LOCAL_SECRET,
            algo: process.env.JWT_LOCAL_ALGO,
            expiresIn: !constant_1.__prod__ ? "30d" : "1d",
        },
    },
    nodemailer: {
        username: process.env.NODEMAILER_USERNAME,
        password: process.env.NODEMAILER_PASSWORD,
    },
    platform: {
        url: process.env.VOTING_PLATFORM_URL,
        shortUrl: process.env.VOTIING_PLATFORM_SHORT_URL,
    },
    ballotReceiptPreWord: "TUPELECT",
};
exports.default = configs;
//# sourceMappingURL=index.js.map