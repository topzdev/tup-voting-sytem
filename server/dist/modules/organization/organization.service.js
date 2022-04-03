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
const typeorm_1 = require("typeorm");
const http_exception_1 = require("../../helpers/errors/http.exception");
const photo_uploader_helper_1 = __importDefault(require("../../helpers/photo-uploader.helper"));
const organization_logo_entity_1 = require("./entity/organization-logo.entity");
const organization_theme_entity_1 = require("./entity/organization-theme.entity");
const organization_entity_1 = require("./entity/organization.entity");
// const User = getRepository(User);
const getAll = (_query) => __awaiter(void 0, void 0, void 0, function* () {
    const orgRepository = (0, typeorm_1.getRepository)(organization_entity_1.Organization);
    const searchStirng = _query.search ? _query.search : "";
    const withArchive = _query.withArchive;
    let builder = orgRepository
        .createQueryBuilder("org")
        .leftJoinAndSelect("org.logo", "logo")
        .leftJoinAndSelect("org.theme", "theme")
        .orderBy({
        "org.created_at": "ASC",
    });
    if (!withArchive) {
        builder = builder.andWhere("org.archive = :bol", { bol: false });
    }
    if (searchStirng) {
        builder = builder.andWhere("org.ticker ILIKE :ticker", {
            ticker: `%${searchStirng}%`,
        });
        console.log("Search String: ", searchStirng);
        builder = builder.andWhere("org.title ILIKE :title", {
            title: `%${searchStirng}%`,
        });
    }
    if (_query.order) {
        builder = builder.orderBy({
            "org.title": _query.order,
            "org.ticker": _query.order,
        });
    }
    if (_query.page && _query.take) {
        const offset = _query.page * _query.take - _query.take;
        console.log("OFFSET", offset);
        builder = builder.offset(offset).limit(_query.take);
    }
    const [items, count] = yield builder.getManyAndCount();
    return {
        items,
        totalCount: count,
        itemsCount: items.length,
    };
});
const isExistBySlug = (_slug) => __awaiter(void 0, void 0, void 0, function* () {
    return !!(yield getBySlug(_slug));
});
const getById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_id)
        throw new http_exception_1.HttpException("BAD_REQUEST", "Organization ID is required");
    const organization = yield organization_entity_1.Organization.findOne(_id, {
        relations: ["logo", "theme"],
        where: {
            archive: false,
        },
    });
    return organization || null;
});
const getBySlug = (_slug) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_slug)
        throw new http_exception_1.HttpException("BAD_REQUEST", "Organization slug is required");
    const organization = yield organization_entity_1.Organization.findOne({
        where: {
            slug: _slug,
            archive: false,
        },
        relations: ["logo", "theme"],
    });
    return organization || null;
});
const create = (_logo, _organization) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_organization.slug) {
        throw new http_exception_1.HttpException("BAD_REQUEST", "Organization slug is required");
    }
    const exist = yield organization_entity_1.Organization.findOne({
        where: {
            slug: _organization.slug,
        },
    });
    if (exist) {
        throw new http_exception_1.HttpException("BAD_REQUEST", "Slug is already taken");
    }
    const uploadedLogo = yield photo_uploader_helper_1.default.upload("org_photos", _logo.tempFilePath);
    const organizationLogo = organization_logo_entity_1.OrganizationLogo.create({
        public_id: uploadedLogo.public_id,
        url: uploadedLogo.secure_url,
    });
    const organizationTheme = organization_theme_entity_1.OrganizationTheme.create({
        primary: _organization.theme_primary,
        secondary: _organization.theme_secondary,
    });
    yield organizationLogo.save();
    yield organizationTheme.save();
    const organization = organization_entity_1.Organization.create({
        slug: _organization.slug,
        title: _organization.title,
        description: _organization.description,
        ticker: _organization.ticker,
        logo: organizationLogo,
        theme: organizationTheme,
    });
    const savedOrganization = yield organization.save();
    console.log(savedOrganization);
    return organization;
});
const update = (_logo, _organization) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_organization.id) {
        throw new http_exception_1.HttpException("BAD_REQUEST", "Organization ID is required");
    }
    const curOrganization = yield organization_entity_1.Organization.findOne(_organization.id, {
        relations: ["logo", "theme"],
    });
    if (!curOrganization) {
        throw new http_exception_1.HttpException("NOT_FOUND", "Organization not found");
    }
    let toUpdateSlug = curOrganization.slug;
    console.log("Prev:", curOrganization, "Passed:", _organization);
    // Check if slug is different from previous record of slug
    if (curOrganization.slug !== _organization.slug) {
        //find if slug exist on other organization
        const slugExist = yield organization_entity_1.Organization.findOne({
            where: {
                id: (0, typeorm_1.Not)(curOrganization.id),
                slug: _organization.slug,
            },
        });
        // if slug exist on other organization then return an error
        if (slugExist) {
            throw new http_exception_1.HttpException("BAD_REQUEST", "Organization slug has been used");
        }
        toUpdateSlug = _organization.slug;
    }
    let toUpdateLogo = curOrganization.logo;
    if (_logo && _logo.tempFilePath) {
        //since there is a new logo provided we will destroy the exisiting image then replace before uploading a new one, so when error occcured on destory image the whole process will stop
        if (curOrganization.logo) {
            yield photo_uploader_helper_1.default.destroy(curOrganization.logo.public_id);
        }
        const uploadedLogo = yield photo_uploader_helper_1.default.upload("org_photos", _logo.tempFilePath);
        // if the previous logo is null then save the new logo
        // else replaced the old public_id and url
        if (!curOrganization.logo) {
            console.log("Logo is EMPTY so saving a new one");
            toUpdateLogo = organization_logo_entity_1.OrganizationLogo.create({
                public_id: uploadedLogo.public_id,
                url: uploadedLogo.url,
            });
            toUpdateLogo = yield toUpdateLogo.save();
        }
        else {
            console.log("Logo is AVAILABLE so saving a new one");
            toUpdateLogo.public_id = uploadedLogo.public_id;
            toUpdateLogo.url = uploadedLogo.url;
        }
    }
    console.log("Logo Data", toUpdateLogo);
    // assign the current theme
    let toUpdateTheme = curOrganization.theme;
    // check if the current data has theme, if empty then create a theme and save it
    if (!curOrganization.theme) {
        toUpdateTheme = organization_theme_entity_1.OrganizationTheme.create({
            secondary: _organization.theme_secondary,
            primary: _organization.theme_primary,
        });
        toUpdateTheme = yield toUpdateTheme.save();
    }
    else {
        // if theme is avaiable, replace the current theme with the new / updated theme
        toUpdateTheme.secondary = _organization.theme_secondary;
        toUpdateTheme.primary = _organization.theme_primary;
    }
    console.log("Theme Data", toUpdateTheme);
    const toUpdateOrganization = organization_entity_1.Organization.merge(curOrganization, {
        title: _organization.title,
        description: _organization.description,
        ticker: _organization.ticker,
        slug: toUpdateSlug,
        logo: toUpdateLogo,
        theme: toUpdateTheme,
    });
    yield organization_logo_entity_1.OrganizationLogo.update(toUpdateLogo.id, toUpdateLogo);
    yield organization_theme_entity_1.OrganizationTheme.update(toUpdateTheme.id, toUpdateTheme);
    yield organization_entity_1.Organization.update(curOrganization.id, toUpdateOrganization);
    return true;
});
const remove = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_id) {
        throw new http_exception_1.HttpException("BAD_REQUEST", "Organization id is required");
    }
    const organization = yield organization_entity_1.Organization.findOne(_id);
    if (!organization) {
        throw new http_exception_1.HttpException("NOT_FOUND", "Organization not found");
    }
    yield organization.softRemove();
    return true;
});
const restore = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_id) {
        throw new http_exception_1.HttpException("BAD_REQUEST", "Organization id is required");
    }
    const organization = yield organization_entity_1.Organization.findOne(_id, {
        withDeleted: true,
    });
    if (!organization) {
        throw new http_exception_1.HttpException("NOT_FOUND", "Organization not found");
    }
    yield organization.recover();
    return true;
});
const archive = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_id) {
        throw new http_exception_1.HttpException("BAD_REQUEST", "Organization id is required");
    }
    const organization = yield organization_entity_1.Organization.findOne(_id);
    if (!organization) {
        throw new http_exception_1.HttpException("NOT_FOUND", "Organization not found");
    }
    organization.archive = true;
    yield organization.save();
    return true;
});
const unarchive = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_id) {
        throw new http_exception_1.HttpException("BAD_REQUEST", "Organization id is required");
    }
    const organization = yield organization_entity_1.Organization.findOne(_id);
    if (!organization) {
        throw new http_exception_1.HttpException("NOT_FOUND", "Organization not found");
    }
    organization.archive = false;
    yield organization.save();
    return true;
});
const organizationServices = {
    getAll,
    getById,
    getBySlug,
    create,
    update,
    remove,
    restore,
    archive,
    unarchive,
    isExistBySlug,
};
exports.default = organizationServices;
//# sourceMappingURL=organization.service.js.map