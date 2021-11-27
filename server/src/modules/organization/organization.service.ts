import { validate } from "class-validator";
import { getRepository, Not } from "typeorm";
import { HttpException } from "../../helpers/errors/http.exception";
import photoUploader from "../../helpers/photo-uploader.helper";
import { Photo } from "../photo/photo.service";
import { OrganizationLogo } from "./entity/organization-logo.entity";
import { Organization } from "./entity/organization.entity";
import {
  CreateOrganizationParams,
  GetOrganizationParams,
  UpdateOrganizationParams,
} from "./organization.inteface";

// const User = getRepository(User);

const getAll = async (_query: GetOrganizationParams) => {
  const orgRepository = getRepository(Organization);

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

  const [organization, count] = await builder.getManyAndCount();

  return {
    organization,
    count,
  };
};

const isExistBySlug = async (_slug: string) => {
  return !!(await getBySlug(_slug));
};

const getById = async (_id: string) => {
  if (!_id)
    return new HttpException("BAD_REQUEST", "Organization ID not provided");

  const organization = Organization.findOne(_id, {
    relations: ["logo"],
  });

  return organization;
};

const getBySlug = async (_slug: string) => {
  if (!_slug)
    return new HttpException("BAD_REQUEST", "Organization Slug not provided");

  const organization = Organization.findOne({
    where: {
      slug: _slug,
    },
    relations: ["logo"],
  });

  return organization;
};

const create = async (
  _logo: Photo,
  _organization: CreateOrganizationParams
) => {
  if (!_organization.slug) {
    throw new HttpException("BAD_REQUEST", "Organization slug is required");
  }

  const exist = await Organization.findOne({
    where: {
      slug: _organization.slug,
    },
  });

  if (exist) {
    throw new HttpException("BAD_REQUEST", "Slug is already taken");
  }

  const uploadedLogo = await photoUploader.upload(
    "org_photos",
    _logo.tempFilePath
  );

  const organizationLogo = OrganizationLogo.create({
    public_id: uploadedLogo.public_id,
    url: uploadedLogo.secure_url,
  });

  const organization = Organization.create(_organization);
  organization.logo = organizationLogo;

  const errors = await validate(organization);

  if (errors.length > 0) {
    throw new HttpException("BAD_REQUEST", "Something went wrong");
  }

  await organizationLogo.save();
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

  const prevOrganization = await Organization.findOne(_organization.id, {
    relations: ["logo"],
  });

  if (!prevOrganization) {
    throw new HttpException("NOT_FOUND", "Organization not found");
  }

  let newSlug = prevOrganization.slug;

  console.log("Prev:", prevOrganization, "Passed:", _organization);

  // Check if slug is different from previous record of slug
  if (prevOrganization.slug !== _organization.slug) {
    //find if slug exist on other organization
    const slugExist = await Organization.findOne({
      where: {
        id: Not(prevOrganization.id),
        slug: _organization.slug,
      },
    });

    // if slug exist on other organization then return an error
    if (slugExist) {
      throw new HttpException("BAD_REQUEST", "Organization slug has been used");
    }

    newSlug = _organization.slug;
  }

  let newLogo = prevOrganization.logo;

  if (_logo && _logo.tempFilePath) {
    const uploadedLogo = await photoUploader.upload(
      "org_photos",
      _logo.tempFilePath
    );
    // if the previous logo is null then save the new logo
    // else replaced the old public_id and url
    if (!prevOrganization.logo) {
      newLogo = OrganizationLogo.create({
        public_id: uploadedLogo.public_id,
        url: uploadedLogo.url,
      });
      await newLogo.save();
    } else {
      newLogo.public_id = uploadedLogo.public_id;
      newLogo.url = uploadedLogo.url;
    }
  }

  await Organization.update(_organization.id, {
    ..._organization,
    slug: newSlug,
    logo: newLogo,
  });
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

  const organization = await Organization.findOne(_id);

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

  await organization.recover();
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
  isExistBySlug,
};

export default organizationServices;
