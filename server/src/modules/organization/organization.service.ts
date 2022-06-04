import { validate } from "class-validator";
import { getRepository, Not } from "typeorm";
import { HttpException } from "../../helpers/errors/http.exception";
import photoUploader from "../../helpers/photo-uploader.helper";
import { PickedUser } from "../../type/express-serve-static-core";
import { Election } from "../election/entity/election.entity";
import { Photo } from "../photo/photo.service";
import { OrganizationLogo } from "./entity/organization-logo.entity";
import { OrganizationTheme } from "./entity/organization-theme.entity";
import { Organization } from "./entity/organization.entity";
import organizationHelper from "./organization.helper";
import {
  CreateOrganizationParams,
  GetOrganizationParams,
  UpdateOrganizationParams,
} from "./organization.interface";

// const User = getRepository(User);

const getAll = async (user: PickedUser, _query: GetOrganizationParams) => {
  const orgRepository = getRepository(Organization);

  const searchStirng = _query.search ? _query.search : "";

  const withArchive = _query.withArchive;

  let builder = orgRepository
    .createQueryBuilder("org")
    .leftJoinAndSelect("org.logo", "logo")
    .leftJoinAndSelect("org.theme", "theme");

  const election_officer = user.election_officer;
  if (election_officer) {
    builder = builder
      .leftJoinAndSelect("org.election_officers", "election_officers")
      .andWhere("election_officers.id = :election_officer_id", {
        election_officer_id: 6,
      });
  }

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

  builder = builder.orderBy({
    "org.created_at": "ASC",
  });

  const [items, count] = await builder.getManyAndCount();
  return {
    items,
    totalCount: count,
    itemsCount: items.length,
  };
};

const isExistBySlug = async (_slug: string) => {
  return !!(await getBySlug(_slug));
};

const getById = async (_id: string) => {
  if (!_id)
    throw new HttpException("BAD_REQUEST", "Organization ID is required");

  const organization = await Organization.findOne(_id, {
    relations: ["logo", "theme"],
    where: {
      archive: false,
    },
  });

  if (!organization)
    throw new HttpException("NOT_FOUND", "Organization not found");

  return organization;
};

const getBySlug = async (_slug: string) => {
  if (!_slug)
    throw new HttpException("BAD_REQUEST", "Organization slug is required");

  const organization = await Organization.findOne({
    where: {
      slug: _slug,
      archive: false,
    },
    relations: ["logo", "theme"],
  });

  if (!organization)
    throw new HttpException("NOT_FOUND", "Organization not found");

  return organization || null;
};

const create = async (
  _logo: Photo,
  _organization: CreateOrganizationParams
) => {
  const uploadedLogo = await photoUploader.upload(
    "org_photos",
    _logo.tempFilePath
  );

  const organizationLogo = OrganizationLogo.create({
    public_id: uploadedLogo.public_id,
    url: uploadedLogo.secure_url,
  });

  const organizationTheme = OrganizationTheme.create({
    primary: _organization.theme_primary,
    secondary: _organization.theme_secondary,
  });

  await organizationLogo.save();
  await organizationTheme.save();

  const organization = Organization.create({
    slug: organizationHelper.generateOrganizationSlug(),
    title: _organization.title,
    description: _organization.description,
    ticker: _organization.ticker,
    logo: organizationLogo,
    theme: organizationTheme,
  });

  const savedOrganization = await organization.save();

  console.log(savedOrganization);

  return organization;
};

const update = async (
  _logo: Photo,
  _organization: UpdateOrganizationParams
) => {
  if (!_organization.id) {
    throw new HttpException("BAD_REQUEST", "Organization ID is required");
  }

  const curOrganization = await Organization.findOne(_organization.id, {
    relations: ["logo", "theme"],
  });

  if (!curOrganization) {
    throw new HttpException("NOT_FOUND", "Organization not found");
  }

  let toUpdateLogo = curOrganization.logo;

  if (_logo && _logo.tempFilePath) {
    //since there is a new logo provided we will destroy the exisiting image then replace before uploading a new one, so when error occcured on destory image the whole process will stop
    if (curOrganization.logo) {
      await photoUploader.destroy(curOrganization.logo.public_id);
    }

    const uploadedLogo = await photoUploader.upload(
      "org_photos",
      _logo.tempFilePath
    );

    // if the previous logo is null then save the new logo
    // else replaced the old public_id and url
    if (!curOrganization.logo) {
      console.log("Logo is EMPTY so saving a new one");
      toUpdateLogo = OrganizationLogo.create({
        public_id: uploadedLogo.public_id,
        url: uploadedLogo.url,
      });
      toUpdateLogo = await toUpdateLogo.save();
    } else {
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
    toUpdateTheme = OrganizationTheme.create({
      secondary: _organization.theme_secondary,
      primary: _organization.theme_primary,
    });

    toUpdateTheme = await toUpdateTheme.save();
  } else {
    // if theme is avaiable, replace the current theme with the new / updated theme
    toUpdateTheme.secondary = _organization.theme_secondary;
    toUpdateTheme.primary = _organization.theme_primary;
  }

  console.log("Theme Data", toUpdateTheme);

  const toUpdateOrganization = Organization.merge(curOrganization, {
    title: _organization.title,
    description: _organization.description,
    ticker: _organization.ticker,
    logo: toUpdateLogo,
    theme: toUpdateTheme,
  });

  await OrganizationLogo.update(toUpdateLogo.id, toUpdateLogo);
  await OrganizationTheme.update(toUpdateTheme.id, toUpdateTheme);
  await Organization.update(curOrganization.id, toUpdateOrganization);
  return true;
};

const remove = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Organization id is required");
  }

  const organization = await Organization.findOne(_id);

  if (!organization) {
    throw new HttpException("NOT_FOUND", "Organization not found");
  }

  await organization.softRemove();

  return true;
};

const restore = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Organization id is required");
  }

  const organization = await Organization.findOne(_id, {
    withDeleted: true,
  });

  if (!organization) {
    throw new HttpException("NOT_FOUND", "Organization not found");
  }

  await organization.recover();
  return true;
};

const archive = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Organization id is required");
  }

  const organization = await Organization.findOne(_id);

  if (!organization) {
    throw new HttpException("NOT_FOUND", "Organization not found");
  }

  organization.archive = true;

  await organization.save();
  return true;
};

const unarchive = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Organization id is required");
  }

  const organization = await Organization.findOne(_id);

  if (!organization) {
    throw new HttpException("NOT_FOUND", "Organization not found");
  }

  organization.archive = false;

  await organization.save();
  return true;
};

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

export default organizationServices;
