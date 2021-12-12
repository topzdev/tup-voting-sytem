"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const out_1 = require("connect-typeorm/out");
const express_session_1 = __importDefault(require("express-session"));
const typeorm_1 = require("typeorm");
const session_entity_1 = require("../entity/session.entity");
const index_1 = __importDefault(require("./index"));
const sessionConfig = (app) => {
    console.log("Session loaded");
    const sessionRepository = (0, typeorm_1.getConnection)().getRepository(session_entity_1.Session);
    app.use((0, express_session_1.default)({
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // i day cache
        },
        store: new out_1.TypeormStore({
            cleanupLimit: 2,
        }).connect(sessionRepository),
        secret: index_1.default.session.secret,
    }));
};
exports.default = sessionConfig;
//# sourceMappingURL=session.config.js.map