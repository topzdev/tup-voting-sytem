import { Brackets, getRepository, Not } from "typeorm";
import { HttpException } from "../../helpers/errors/http.exception";
import parseDate from "../../helpers/parse-date.helper";
import photoUploader from "../../helpers/photo-uploader.helper";
import { PickedUser } from "../../type/express-serve-static-core";
import { Candidate } from "../candidate/entity/candidate.entity";
import { finalStatusSubquery } from "../launchpad/launchpad.helper";
import { Organization } from "../organization/entity/organization.entity";
import overviewHelpers from "../overview/overview.helpers";
import { Photo } from "../photo/photo.service";
import electionHelper from "./election.helper";
import {
  CreateElectionBody,
  GetElectionBody,
  UpdateElectionBody,
} from "./election.interface";
import { ElectionLogo } from "./entity/election-logo.entity";
import { Election } from "./entity/election.entity";
const getAll = async (
  _orgId: Organization["id"],
  user: PickedUser,
  _query: GetElectionBody
) => {
  const electionRepository = getRepository(Election);
  const searchStirng = _query.search ? _query.search : "";
  const withArchive = _query.withArchive ? _query.withArchive : "";
  if (!_orgId) {
    throw new HttpException("BAD_REQUEST", "Organization Id is required");
  }

  await electionHelper.electionOfficerGuard(user, _orgId);

  let builder = electionRepository.createQueryBuilder("election");

  builder = builder
    .addSelect(finalStatusSubquery(builder.alias))
    .leftJoinAndSelect("election.logo", "logo")
    .where("election.organization_id = :orgId", {
      orgId: _orgId,
    });

  if (searchStirng) {
    builder = builder.andWhere(
      new Brackets((sqb) => {
        sqb.orWhere("election.title ILIKE :title", {
          title: `%${searchStirng}%`,
        });
      })
    );
  }

  if (!withArchive) {
    builder = builder.andWhere("election.archive = :withArchive", {
      withArchive: false,
    });
  }

  builder = builder.orderBy({
    "election.created_at": "DESC",
  });

  if (_query.order) {
    builder = builder.addOrderBy("election.title", _query.order);
  }

  if (_query.page && _query.take) {
    const offset = _query.page * _query.take - _query.take;
    builder = builder.offset(offset).limit(_query.take);
  }

  const [items, itemsCount] = await builder.getManyAndCount();

  const totalCount = await electionRepository.count({
    where: { organization_id: _orgId },
  });

  return {
    items,
    totalCount,
    itemsCount,
  };
};

const getElectionWinners = async (_election_id: number) => {
  const candidateRepository = getRepository(Candidate);

  let builder = await candidateRepository.createQueryBuilder("candidates");

  builder = builder
    .leftJoinAndSelect("candidates.profile_photo", "profile_photo")
    .leftJoinAndSelect("candidates.party", "party")
    .leftJoinAndSelect("party.logo", "party_logo")
    .leftJoinAndSelect("candidates.votes", "votes")
    .loadRelationCountAndMap("candidates.votesCount", "candidates.votes")

    .leftJoinAndSelect("candidates.election", "election")
    //.where("election.final_status = 'completed'")
    .andWhere("election.is_tally_public = true")
    .andWhere("candidates.election_id = :_election_id", { _election_id });

  return await builder.getMany();
};

const getBySlug = async (_slug: string) => {
  if (!_slug)
    throw new HttpException("BAD_REQUEST", "Election slug is required");

  const electionRepository = getRepository(Election);

  let builder = electionRepository.createQueryBuilder("election");

  builder = builder
    .addSelect(finalStatusSubquery(builder.alias))
    .leftJoinAndSelect("election.logo", "logo")
    .leftJoinAndSelect("election.organization", "organization")
    .leftJoinAndSelect("organization.theme", "organization_theme")
    .leftJoinAndSelect("organization.logo", "organization_logo")
    .where("election.slug = :_slug", { _slug });

  const election = await builder.getOne();

  const urls = overviewHelpers.generateElectionUrls(election);

  return { ...election, urls } || null;
};

const isExistBySlug = async (_slug: string) => {
  return !!(await getBySlug(_slug));
};

const getById = async (user: PickedUser, _election_id: string) => {
  if (!_election_id)
    throw new HttpException("BAD_REQUEST", "Election ID is required");

  const electionRepository = getRepository(Election);

  let builder = electionRepository.createQueryBuilder("election");

  builder = builder
    .addSelect(finalStatusSubquery(builder.alias))
    .leftJoinAndSelect("election.logo", "logo")
    .leftJoinAndSelect("election.organization", "organization")
    .leftJoinAndSelect("organization.theme", "organization_theme")
    .leftJoinAndSelect("organization.logo", "organization_logo")
    .loadRelationCountAndMap("election.partiesCount", "election.party")
    .loadRelationCountAndMap("election.candidatesCount", "election.candidates")
    .loadRelationCountAndMap("election.positionsCount", "election.positions")
    .where("election.id = :_election_id", { _election_id });

  const election = await builder.getOne();

  if (!election) throw new HttpException("NOT_FOUND", "Election not found");

  await electionHelper.electionOfficerGuard(user, election.organization_id);

  const urls = overviewHelpers.generateElectionUrls(election);

  return { ...election, urls } || null;
};

const create = async (_logo: Photo, _election: CreateElectionBody) => {
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
    slug: electionHelper.generateElectionSlug(),
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
        url: uploadedLogo.secure_url,
      });
      await toUpdateLogo.save();
    } else {
      toUpdateLogo.public_id = uploadedLogo.public_id;
      toUpdateLogo.url = uploadedLogo.secure_url;
    }
  }

  const toUpdateElection = Election.merge(curElection, {
    title: _election.title,
    description: _election.description,
    start_date: parseDate(_election.start_date),
    close_date: parseDate(_election.close_date),
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
  getElectionWinners,
};

export default electionServices;
