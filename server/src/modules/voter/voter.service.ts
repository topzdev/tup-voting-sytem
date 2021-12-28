import { validate } from "class-validator";
import { getRepository, Not } from "typeorm";
import { HttpException } from "../../helpers/errors/http.exception";
import photoUploader from "../../helpers/photo-uploader.helper";
import { Photo } from "../photo/photo.service";
import { Voter } from "./entity/voter.entity";
import {
  CreateVoterBody,
  GetVoterBody,
  ImportVoterByElectionDto,
  ImportVotersByElectionDto,
  UpdateVoterBody,
} from "./voter.interface";
import { Organization } from "../organization/entity/organization.entity";
import parseDate from "../../helpers/parse-date.helper";
import { ElectionMember } from "../election/entity/election-member.entity";

const getAll = async (_query: GetVoterBody) => {
  const voterRepository = getRepository(Voter);
  const searchStirng = _query.search ? _query.search : "";

  let builder = voterRepository.createQueryBuilder("voter");

  if (_query.org_id) {
    builder = builder.andWhere("voter.organization_id = :orgId", {
      orgId: _query.org_id,
    });
  }

  if (searchStirng) {
    builder = builder.orWhere("voter.firstname ILIKE :firstname", {
      firstname: `%${searchStirng}%`,
    });

    builder = builder.orWhere("voter.lastname ILIKE :lastname", {
      lastname: `%${searchStirng}%`,
    });
  }

  if (_query.order) {
    builder = builder.orderBy({
      "voter.firstname": _query.order,
    });
    builder = builder.orderBy({
      "voter.lastname": _query.order,
    });
  }

  if (_query.page && _query.take) {
    const offset = _query.page * _query.take - _query.take;
    builder = builder.offset(offset).limit(_query.take);
  }

  const [voters, count] = await builder.getManyAndCount();

  return {
    items: voters,
    count,
  };
};

const getByVoterId = async (_voterId: string) => {
  if (!_voterId) throw new HttpException("BAD_REQUEST", "Voter ID is required");

  const voter = await Voter.findOne({
    where: {
      voter_id: _voterId,
    },
  });

  return voter || null;
};

const isExistByVoterId = async (_slug: string) => {
  return !!(await getByVoterId(_slug));
};

const getByEmailAddress = async (_emailAddress: string) => {
  if (!_emailAddress)
    throw new HttpException("BAD_REQUEST", "Voter Email Address is required");

  const voter = await Voter.findOne({
    where: {
      email_address: _emailAddress,
    },
  });

  return voter || null;
};

const isExistByEmailAddress = async (_slug: string) => {
  return !!(await getByEmailAddress(_slug));
};

const getById = async (_id: string) => {
  if (!_id) throw new HttpException("BAD_REQUEST", "Voter ID is required");

  const voter = await Voter.findOne(_id);

  console.log(voter);

  return voter || null;
};

const create = async (_logo: Photo, _voter: CreateVoterBody) => {
  if (!_voter.election_id) {
    throw new HttpException("BAD_REQUEST", "Election is required");
  }

  if (!_voter.organization_id)
    throw new HttpException("BAD_REQUEST", "Organization is required");

  const voter = Voter.create({
    firstname: _voter.firstname,
    lastname: _voter.lastname,
    email_address: _voter.email_address,
    voter_id: _voter.voter_id,
    pin: _voter.pin,
    organization_id: _voter.organization_id,
  });
  const savedVoter = await voter.save();

  const electionMember = ElectionMember.create({
    voter_id: voter.id,
    election_id: _voter.election_id,
  });

  const savedElectionMember = electionMember.save();

  console.log(savedVoter, savedElectionMember);

  return voter;
};

const update = async (_logo: Photo, _voter: UpdateVoterBody) => {
  if (!_voter.id) {
    throw new HttpException("BAD_REQUEST", "Voter ID is required");
  }

  if (!_voter.organization_id)
    throw new HttpException("BAD_REQUEST", "Organization is required");

  const curVoter = await Voter.findOne(_voter.id);

  if (!curVoter) {
    throw new HttpException("NOT_FOUND", "Voter not found");
  }

  const toUpdateVoter = Voter.merge(curVoter, {
    firstname: _voter.firstname,
    lastname: _voter.lastname,
    email_address: _voter.email_address,
    voter_id: _voter.voter_id,
    pin: _voter.pin,
    organization_id: _voter.organization_id,
  });

  await Voter.update(_voter.id, toUpdateVoter);
  return true;
};

const remove = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Voter id is required");
  }

  const voter = await Voter.findOne(_id);

  if (!voter) {
    throw new HttpException("NOT_FOUND", "Voter not found");
  }

  // Soft remove only so that we can restore it
  await voter.softRemove();

  return true;
};

const restore = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Voter id is required");
  }

  const voter = await Voter.findOne(_id, {
    withDeleted: true,
  });

  if (!voter) {
    throw new HttpException("NOT_FOUND", "Voter not found");
  }

  await voter.recover();
  return true;
};

const checkVotedOnElectionById = async (
  _electionId: number,
  _voterId: number
) => {
  if (!_electionId)
    throw new HttpException("BAD_REQUEST", "Election ID is required");
  if (!_voterId) throw new HttpException("BAD_REQUEST", "Voter ID is required");

  const data = await ElectionMember.findOne({
    where: {
      election_id: _electionId,
      voter_id: _voterId,
      is_voted: true,
    },
  });

  return data || null;
};

const importVotersByElection = async (_dto: ImportVotersByElectionDto) => {
  const electionIds = _dto.electionIds;

  if (!electionIds.from || !electionIds.to)
    throw new HttpException("BAD_REQUEST", "Election ID's are required");

  const electionMembers = await ElectionMember.find({
    where: {
      election_id: electionIds.from,
    },
    select: ["voter_id"],
  });

  if (!electionMembers.length)
    throw new HttpException("BAD_REQUEST", "No Election Members found");

  const insertedElectionMember = await ElectionMember.insert(
    electionMembers.map((item) => ({
      voter_id: item.voter_id,
      election_id: electionIds.to,
    }))
  );

  console.log(insertedElectionMember);

  return true;
};

const exportVoters = async (_electionId: number) => {};

const voterServices = {
  getAll,
  getById,
  getByEmailAddress,
  getByVoterId,
  create,
  update,
  remove,
  restore,
  isExistByEmailAddress,
  isExistByVoterId,
  checkVotedOnElectionById,
};

export default voterServices;
