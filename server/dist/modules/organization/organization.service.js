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
const organization_entity_1 = require("./entity/organization.entity");
// const User = getRepository(User);
const getAll = (_query) => __awaiter(void 0, void 0, void 0, function* () {
    const orgRepository = (0, typeorm_1.getRepository)(organization_entity_1.Organization);
    const searchStirng = _query.search ? _query.search : "";
    const withArchive = _query.withArchive;
    let builder = orgRepository
        .createQueryBuilder("org")
        .leftJoinAndSelect("org.logo", "logo");
    if (!withArchive) {
        builder = builder.andWhere("org.archive = :bol", { bol: false });
    }
    if (searchStirng) {
        builder = builder.orWhere("org.ticker ILIKE :ticker", {
            ticker: `%${searchStirng}%`,
        });
        builder = builder.orWhere("org.title ILIKE :title", {
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
    const [organization, count] = yield builder.getManyAndCount();
    return {
        organization,
        count,
    };
});
const isExistBySlug = (_slug) => __awaiter(void 0, void 0, void 0, function* () {
    return !!(yield getBySlug(_slug));
});
const getById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_id)
        return new http_exception_1.HttpException("BAD_REQUEST", "Organization ID not provided");
    const organization = organization_entity_1.Organization.findOne(_id, {
        relations: ["logo"],
    });
    return organization;
});
const getBySlug = (_slug) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_slug)
        return new http_exception_1.HttpException("BAD_REQUEST", "Organization Slug not provided");
    const organization = organization_entity_1.Organization.findOne({
        where: {
            slug: _slug,
        },
        relations: ["logo"],
    });
    return organization;
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
    const organization = organization_entity_1.Organization.create(_organization);
    organization.logo = organizationLogo;
    yield organizationLogo.save();
    const savedOrganization = yield organization.save();
    console.log(savedOrganization);
    return organization;
});
const update = (_logo, _organization) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_organization.id) {
        throw new http_exception_1.HttpException("BAD_REQUEST", "Organization ID is required");
    }
    const prevOrganization = yield organization_entity_1.Organization.findOne(_organization.id, {
        relations: ["logo"],
    });
    if (!prevOrganization) {
        throw new http_exception_1.HttpException("NOT_FOUND", "Organization not found");
    }
    let newSlug = prevOrganization.slug;
    console.log("Prev:", prevOrganization, "Passed:", _organization);
    // Check if slug is different from previous record of slug
    if (prevOrganization.slug !== _organization.slug) {
        //find if slug exist on other organization
        const slugExist = yield organization_entity_1.Organization.findOne({
            where: {
                id: (0, typeorm_1.Not)(prevOrganization.id),
                slug: _organization.slug,
            },
        });
        // if slug exist on other organization then return an error
        if (slugExist) {
            throw new http_exception_1.HttpException("BAD_REQUEST", "Organization slug has been used");
        }
        newSlug = _organization.slug;
    }
    let newLogo = prevOrganization.logo;
    if (_logo && _logo.tempFilePath) {
        //since there is a new logo provided we will destroy the exisiting image then replace before uploading a new one, so when error occcured on destory image the whole process will stop
        if (prevOrganization.logo) {
            yield photo_uploader_helper_1.default.destroy(prevOrganization.logo.public_id);
        }
        const uploadedLogo = yield photo_uploader_helper_1.default.upload("org_photos", _logo.tempFilePath);
        // if the previous logo is null then save the new logo
        // else replaced the old public_id and url
        if (!prevOrganization.logo) {
            newLogo = organization_logo_entity_1.OrganizationLogo.create({
                public_id: uploadedLogo.public_id,
                url: uploadedLogo.url,
            });
            yield newLogo.save();
        }
        else {
            newLogo.public_id = uploadedLogo.public_id;
            newLogo.url = uploadedLogo.url;
        }
    }
    const toUpdateOrganization = Object.assign(Object.assign({}, _organization), { slug: newSlug, logo: newLogo });
    yield organization_logo_entity_1.OrganizationLogo.update(newLogo.id, newLogo);
    yield organization_entity_1.Organization.update(_organization.id, toUpdateOrganization);
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