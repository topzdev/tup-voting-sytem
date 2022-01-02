import { validate } from "class-validator";
import { getRepository, Not } from "typeorm";
import { HttpException } from "../../helpers/errors/http.exception";
import photoUploader from "../../helpers/photo-uploader.helper";
import { Photo } from "../photo/photo.service";
import { Election } from "./entity/election.entity";
import {
  CreateElectionBody,
  GetElectionBody,
  UpdateElectionBody,
} from "./election.interface";
import { ElectionLogo } from "./entity/election-logo.entity";
import { Organization } from "../organization/entity/organization.entity";
import parseDate from "../../helpers/parse-date.helper";

const getAll = async (_query: GetElectionBody) => {
  const electionRepository = getRepository(Election);
  const searchStirng = _query.search ? _query.search : "";
  const withArchive = _query.withArchive;

  let builder = electionRepository
    .createQueryBuilder("election")
    .leftJoinAndSelect("election.logo", "logo");

  if (_query.orgId) {
    builder = builder.andWhere("election.organization_id = :orgId", {
      orgId: _query.orgId,
    });
  }

  if (!withArchive) {
    builder = builder.andWhere("election.archive = :bol", { bol: false });
  }

  if (searchStirng) {
    builder = builder.andWhere("election.title ILIKE :title", {
      title: `%${searchStirng}%`,
    });
  }

  if (_query.order) {
    builder = builder.orderBy({
      "election.title": _query.order,
    });
  }

  if (_query.page && _query.take) {
    const offset = _query.page * _query.take - _query.take;
    builder = builder.offset(offset).limit(_query.take);
  }

  const [items, itemsCount] = await builder.getManyAndCount();

  const where: any = {};

  if (_query.orgId) {
    where.organization_id = _query.orgId;
  }

  const totalCount = await electionRepository.count({
    where,
  });
  return {
    items,
    itemsCount,
    totalCount,
  };
};

const getBySlug = async (_slug: string) => {
  if (!_slug)
    throw new HttpException("BAD_REQUEST", "Election slug is required");

  const election = await Election.findOne({
    where: {
      slug: _slug,
      archive: false,
    },
    relations: [
      "logo",
      "organization",
      "organization.theme",
      "organization.logo",
    ],
  });

  return election || null;
};

const isExistBySlug = async (_slug: string) => {
  return !!(await getBySlug(_slug));
};

const getById = async (_id: string) => {
  if (!_id) throw new HttpException("BAD_REQUEST", "Election ID is required");

  const election = await Election.findOne(_id, {
    relations: [
      "logo",
      "organization",
      "organization.theme",
      "organization.logo",
    ],
    where: {
      archive: false,
    },
  });

  console.log(election);

  return election || null;
};

const create = async (_logo: Photo, _election: CreateElectionBody) => {
  if (!_election.slug) {
    throw new HttpException("BAD_REQUEST", "Election slug is required");
  }

  const exist = await Election.findOne({
    where: {
      slug: _election.slug,
    },
  });

  if (exist) {
    throw new HttpException("BAD_REQUEST", "Slug is already taken");
  }

  if (!_election.organization_id)
    throw new HttpException("BAD_REQUEST", "Organization is required");

  const uploadedLogo = await photoUploader.upload(
    "election_photos",
    _logo.tempFilePath
  );

  const electionLogo = ElectionLogo.create({
    public_id: uploadedLogo.public_id,
    url: uploadedLogo.secure_url,
  });

  await electionLogo.save();

  const election = Election.create({
    title: _election.title,
    description: _election.description,
    slug: _election.slug,
    start_date: parseDate(_election.start_date),
    close_date: parseDate(_election.close_date),
    organization_id: _election.organization_id,
    logo: electionLogo,
  });

  const savedElection = await election.save();

  console.log(savedElection);

  return election;
};

const update = async (_logo: Photo, _election: UpdateElectionBody) => {
  if (!_election.id) {
    throw new HttpException("BAD_REQUEST", "Election ID is required");
  }

  const curElection = await Election.findOne(_election.id, {
    relations: ["logo"],
  });

  if (!curElection) {
    throw new HttpException("NOT_FOUND", "Election not found");
  }

  let toUpdateSlug = curElection.slug;

  console.log("Prev:", curElection, "Passed:", _election);

  // Check if slug is different from previous record of slug
  if (curElection.slug !== _election.slug) {
    //find if slug exist on other organization
    const slugExist = await Election.findOne({
      where: {
        id: Not(curElection.id),
        slug: _election.slug,
      },
    });

    // if slug exist on other organization then return an error
    if (slugExist) {
      throw new HttpException("BAD_REQUEST", "Election slug has been used");
    }

    toUpdateSlug = _election.slug;
  }

  // check if organization is not empty
  if (!_election.organization_id) {
    throw new HttpException("BAD_REQUEST", "Organization is required");
  }

  let toUpdateLogo = curElection.logo;

  if (_logo && _logo.tempFilePath) {
    //since there is a new logo provided we will destroy the exisiting image then replace before uploading a new one, so when error occcured on destory image the whole process will stop
    if (curElection.logo) {
      await photoUploader.destroy(curElection.logo.public_id);
    }

    const uploadedLogo = await photoUploader.upload(
      "org_photos",
      _logo.tempFilePath
    );

    // if the previous logo is null then save the new logo
    // else replaced the old public_id and url
    if (!curElection.logo) {
      toUpdateLogo = ElectionLogo.create({
        public_id: uploadedLogo.public_id,
        url: uploadedLogo.url,
      });
      await toUpdateLogo.save();
    } else {
      toUpdateLogo.public_id = uploadedLogo.public_id;
      toUpdateLogo.url = uploadedLogo.url;
    }
  }

  const toUpdateElection = Election.merge(curElection, {
    title: _election.title,
    description: _election.description,
    start_date: parseDate(_election.start_date),
    close_date: parseDate(_election.close_date),
    slug: toUpdateSlug,
    logo: toUpdateLogo,
  });

  await ElectionLogo.update(toUpdateLogo.id, toUpdateLogo);
  await Election.update(_election.id, toUpdateElection);
  return true;
};

const remove = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Election id is required");
  }

  const election = await Election.findOne(_id);

  if (!election) {
    throw new HttpException("NOT_FOUND", "Election not found");
  }

  // Soft remove only so that we can restore it
  await election.softRemove();

  return true;
};

const restore = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Election id is required");
  }

  const election = await Election.findOne(_id, {
    withDeleted: true,
  });

  if (!election) {
    throw new HttpException("NOT_FOUND", "Election not found");
  }

  await election.recover();
  return true;
};

const archive = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Election id is required");
  }

  const election = await Election.findOne(_id);

  if (!election) {
    throw new HttpException("NOT_FOUND", "Election not found");
  }

  election.archive = true;

  await election.save();
  return true;
};

const unarchive = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Election id is required");
  }

  const election = await Election.findOne(_id);

  if (!election) {
    throw new HttpException("NOT_FOUND", "Election not found");
  }

  election.archive = false;

  await election.save();
  return true;
};

const electionServices = {
  getAll,
  getById,
  create,
  update,
  remove,
  restore,
  archive,
  unarchive,
  isExistBySlug,
  getBySlug,
};

export default electionServices;