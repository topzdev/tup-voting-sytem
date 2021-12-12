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
const organization_service_1 = __importDefault(require("./organization.service"));
const flat_1 = require("flat");
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, take, order, search, withArchive } = req.query;
        res.status(200).json(yield organization_service_1.default.getAll({
            page: page ? parseInt(page) : undefined,
            take: take ? parseInt(take) : undefined,
            order,
            search,
            withArchive: withArchive ? Boolean(withArchive) : undefined,
        }));
    }
    catch (error) {
        next(error);
    }
});
const getOneBySlug = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = req.params.slug;
        res.status(200).json(yield organization_service_1.default.getBySlug(slug));
    }
    catch (error) {
        next(error);
    }
});
const getOneById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        res.status(200).json(yield organization_service_1.default.getById(id));
    }
    catch (error) {
        next(error);
    }
});
const isExistBySlug = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = req.params.slug;
        res.status(200).json(yield organization_service_1.default.isExistBySlug(slug));
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logo = req.files.logo;
        const organization = (0, flat_1.unflatten)(req.body);
        console.log(logo, organization);
        res.status(200).json(yield organization_service_1.default.create(logo, organization));
    }
    catch (error) {
        next(error);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logo = req.files
            ? req.files.logo
            : undefined;
        const organization = (0, flat_1.unflatten)(req.body);
        console.log(logo, organization);
        res.status(200).json(yield organization_service_1.default.update(logo, organization));
    }
    catch (error) {
        next(error);
    }
});
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        res.status(200).json(yield organization_service_1.default.remove(id));
    }
    catch (error) {
        next(error);
    }
});
const restore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        res.status(200).json(yield organization_service_1.default.restore(id));
    }
    catch (error) {
        next(error);
    }
});
const archive = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        res.status(200).json(yield organization_service_1.default.archive(id));
    }
    catch (error) {
        next(error);
    }
});
const unarchive = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        res.status(200).json(yield organization_service_1.default.unarchive(id));
    }
    catch (error) {
        next(error);
    }
});
const organizationController = {
    getAll,
    getOneBySlug,
    getOneById,
    create,
    update,
    remove,
    restore,
    isExistBySlug,
    archive,
    unarchive,
};
exports.default = organizationController;
//# sourceMappingURL=organization.controller.js.map